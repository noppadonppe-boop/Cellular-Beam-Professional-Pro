import type {
  FemAnalysisInput,
  FemAnalysisResult,
  FemElementEndForces,
  FemFrameElement,
  FemNode,
  FemNodeDisplacement,
  FemReaction,
  FemUniformElementLoad,
} from "@/core/fem/models";
import { FemAnalysisError } from "@/core/fem/models";
import {
  multiplyMatrix,
  multiplyMatrixVector,
  readMatrixRow,
  readMatrixValue,
  readVectorValue,
  solveLinearSystem,
  transpose,
  zeros,
  type Matrix,
} from "@/core/fem/matrix";

const DOF_PER_NODE = 3;

type ElementGeometry = Readonly<{
  lengthM: number;
  cos: number;
  sin: number;
}>;

export function analyzeLinearFrame2D(input: FemAnalysisInput): FemAnalysisResult {
  validateInput(input);
  const nodeIndex = new Map(input.nodes.map((node, index) => [node.id, index]));
  const dofCount = input.nodes.length * DOF_PER_NODE;
  const globalStiffness = zeros(dofCount, dofCount);
  const loadVector = Array.from({ length: dofCount }, () => 0);

  for (const element of input.elements) {
    const dofs = elementDofs(element, nodeIndex);
    const geometry = getElementGeometry(element, input.nodes, nodeIndex);
    const transformed = transformedStiffness(element, geometry);
    for (let row = 0; row < dofs.length; row += 1) {
      for (let column = 0; column < dofs.length; column += 1) {
        const rowDof = readVectorValue(dofs, row, "element DOF map");
        const columnDof = readVectorValue(dofs, column, "element DOF map");
        const globalRow = readMatrixRow(globalStiffness, rowDof, "global stiffness");
        globalRow[columnDof] =
          readVectorValue(globalRow, columnDof, "global stiffness") +
          readMatrixValue(transformed, row, column, "element stiffness");
      }
    }
  }

  for (const load of input.nodalLoads ?? []) {
    const base = getNodeDofBase(load.nodeId, nodeIndex);
    loadVector[base] = readVectorValue(loadVector, base, "load vector") + (load.fxN ?? 0);
    loadVector[base + 1] = readVectorValue(loadVector, base + 1, "load vector") + (load.fyN ?? 0);
    loadVector[base + 2] = readVectorValue(loadVector, base + 2, "load vector") + (load.mzNm ?? 0);
  }

  for (const load of input.uniformElementLoads ?? []) {
    const element = input.elements.find((item) => item.id === load.elementId);
    if (!element)
      throw new FemAnalysisError(`Uniform load references unknown element ${load.elementId}.`);
    const dofs = elementDofs(element, nodeIndex);
    const geometry = getElementGeometry(element, input.nodes, nodeIndex);
    const localFixedEnd = equivalentUniformLoadVector(load, geometry.lengthM);
    const globalFixedEnd = multiplyMatrixVector(
      transpose(transformationMatrix(geometry)),
      localFixedEnd,
    );
    for (let index = 0; index < dofs.length; index += 1) {
      const dof = readVectorValue(dofs, index, "element DOF map");
      loadVector[dof] =
        readVectorValue(loadVector, dof, "load vector") +
        readVectorValue(globalFixedEnd, index, "global fixed-end vector");
    }
  }

  const restrainedDofs = getRestrainedDofs(input, nodeIndex);
  const freeDofs = Array.from({ length: dofCount }, (_, index) => index).filter(
    (dof) => !restrainedDofs.has(dof),
  );
  const reducedStiffness = freeDofs.map((row) =>
    freeDofs.map((column) => readMatrixValue(globalStiffness, row, column, "global stiffness")),
  );
  const reducedLoads = freeDofs.map((dof) => readVectorValue(loadVector, dof, "load vector"));
  const solvedFree = solveLinearSystem(reducedStiffness, reducedLoads);
  const displacementVector = Array.from({ length: dofCount }, () => 0);
  freeDofs.forEach((dof, index) => {
    displacementVector[dof] = readVectorValue(solvedFree, index, "solved displacement vector");
  });

  const globalForces = multiplyMatrixVector(globalStiffness, displacementVector);
  const reactionVector = globalForces.map(
    (force, index) => force - readVectorValue(loadVector, index, "load vector"),
  );

  return {
    displacements: recoverDisplacements(input.nodes, displacementVector, nodeIndex),
    reactions: recoverReactions(input.nodes, reactionVector, restrainedDofs, nodeIndex),
    elementEndForces: recoverElementEndForces(input, displacementVector, nodeIndex),
    maximumVerticalDisplacementM: Math.min(
      ...recoverDisplacements(input.nodes, displacementVector, nodeIndex).map((item) => item.uyM),
    ),
    solverVersion: "linear-frame-2d-1.0.0",
  };
}

export function localFrameStiffness(element: FemFrameElement, lengthM: number): Matrix {
  const { areaM2, elasticModulusPa, inertiaM4 } = element;
  const axial = (elasticModulusPa * areaM2) / lengthM;
  const flexural = elasticModulusPa * inertiaM4;
  const l2 = lengthM * lengthM;
  const l3 = l2 * lengthM;
  return [
    [axial, 0, 0, -axial, 0, 0],
    [0, (12 * flexural) / l3, (6 * flexural) / l2, 0, (-12 * flexural) / l3, (6 * flexural) / l2],
    [
      0,
      (6 * flexural) / l2,
      (4 * flexural) / lengthM,
      0,
      (-6 * flexural) / l2,
      (2 * flexural) / lengthM,
    ],
    [-axial, 0, 0, axial, 0, 0],
    [0, (-12 * flexural) / l3, (-6 * flexural) / l2, 0, (12 * flexural) / l3, (-6 * flexural) / l2],
    [
      0,
      (6 * flexural) / l2,
      (2 * flexural) / lengthM,
      0,
      (-6 * flexural) / l2,
      (4 * flexural) / lengthM,
    ],
  ];
}

function transformedStiffness(element: FemFrameElement, geometry: ElementGeometry): Matrix {
  const transform = transformationMatrix(geometry);
  return multiplyMatrix(
    multiplyMatrix(transpose(transform), localFrameStiffness(element, geometry.lengthM)),
    transform,
  );
}

function transformationMatrix({ cos, sin }: ElementGeometry): Matrix {
  return [
    [cos, sin, 0, 0, 0, 0],
    [-sin, cos, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, cos, sin, 0],
    [0, 0, 0, -sin, cos, 0],
    [0, 0, 0, 0, 0, 1],
  ];
}

function equivalentUniformLoadVector(load: FemUniformElementLoad, lengthM: number): number[] {
  const qx = load.localXNPerM ?? 0;
  const qy = load.localYNPerM ?? 0;
  return [
    (qx * lengthM) / 2,
    (qy * lengthM) / 2,
    (qy * lengthM * lengthM) / 12,
    (qx * lengthM) / 2,
    (qy * lengthM) / 2,
    (-qy * lengthM * lengthM) / 12,
  ];
}

function recoverElementEndForces(
  input: FemAnalysisInput,
  displacementVector: readonly number[],
  nodeIndex: ReadonlyMap<string, number>,
): FemElementEndForces[] {
  return input.elements.map((element) => {
    const dofs = elementDofs(element, nodeIndex);
    const geometry = getElementGeometry(element, input.nodes, nodeIndex);
    const globalDisplacements = dofs.map((dof) =>
      readVectorValue(displacementVector, dof, "global displacement vector"),
    );
    const localDisplacements = multiplyMatrixVector(
      transformationMatrix(geometry),
      globalDisplacements,
    );
    const elementLoad = input.uniformElementLoads?.find((load) => load.elementId === element.id);
    const fixedEnd = elementLoad
      ? equivalentUniformLoadVector(elementLoad, geometry.lengthM)
      : [0, 0, 0, 0, 0, 0];
    const localForces = multiplyMatrixVector(
      localFrameStiffness(element, geometry.lengthM),
      localDisplacements,
    ).map((force, index) => force - readVectorValue(fixedEnd, index, "fixed-end vector"));
    return {
      elementId: element.id,
      start: {
        axialN: readVectorValue(localForces, 0, "local force vector"),
        shearN: readVectorValue(localForces, 1, "local force vector"),
        momentNm: readVectorValue(localForces, 2, "local force vector"),
      },
      end: {
        axialN: readVectorValue(localForces, 3, "local force vector"),
        shearN: readVectorValue(localForces, 4, "local force vector"),
        momentNm: readVectorValue(localForces, 5, "local force vector"),
      },
    };
  });
}

function recoverDisplacements(
  nodes: readonly FemNode[],
  displacementVector: readonly number[],
  nodeIndex: ReadonlyMap<string, number>,
): FemNodeDisplacement[] {
  return nodes.map((node) => {
    const base = getNodeDofBase(node.id, nodeIndex);
    return {
      nodeId: node.id,
      uxM: readVectorValue(displacementVector, base, "global displacement vector"),
      uyM: readVectorValue(displacementVector, base + 1, "global displacement vector"),
      rzRad: readVectorValue(displacementVector, base + 2, "global displacement vector"),
    };
  });
}

function recoverReactions(
  nodes: readonly FemNode[],
  reactionVector: readonly number[],
  restrainedDofs: ReadonlySet<number>,
  nodeIndex: ReadonlyMap<string, number>,
): FemReaction[] {
  return nodes
    .map((node) => {
      const base = getNodeDofBase(node.id, nodeIndex);
      return {
        nodeId: node.id,
        fxN: restrainedDofs.has(base)
          ? readVectorValue(reactionVector, base, "reaction vector")
          : 0,
        fyN: restrainedDofs.has(base + 1)
          ? readVectorValue(reactionVector, base + 1, "reaction vector")
          : 0,
        mzNm: restrainedDofs.has(base + 2)
          ? readVectorValue(reactionVector, base + 2, "reaction vector")
          : 0,
      };
    })
    .filter((reaction) => reaction.fxN !== 0 || reaction.fyN !== 0 || reaction.mzNm !== 0);
}

function getRestrainedDofs(
  input: FemAnalysisInput,
  nodeIndex: ReadonlyMap<string, number>,
): ReadonlySet<number> {
  const restrained = new Set<number>();
  for (const restraint of input.restraints) {
    const base = getNodeDofBase(restraint.nodeId, nodeIndex);
    if (restraint.ux) restrained.add(base);
    if (restraint.uy) restrained.add(base + 1);
    if (restraint.rz) restrained.add(base + 2);
  }
  return restrained;
}

function elementDofs(element: FemFrameElement, nodeIndex: ReadonlyMap<string, number>): number[] {
  const start = getNodeDofBase(element.startNodeId, nodeIndex);
  const end = getNodeDofBase(element.endNodeId, nodeIndex);
  return [start, start + 1, start + 2, end, end + 1, end + 2];
}

function getNodeDofBase(nodeId: string, nodeIndex: ReadonlyMap<string, number>): number {
  const index = nodeIndex.get(nodeId);
  if (index === undefined) throw new FemAnalysisError(`Unknown node ${nodeId}.`);
  return index * DOF_PER_NODE;
}

function getElementGeometry(
  element: FemFrameElement,
  nodes: readonly FemNode[],
  nodeIndex: ReadonlyMap<string, number>,
): ElementGeometry {
  const start = nodes[nodeIndex.get(element.startNodeId) ?? -1];
  const end = nodes[nodeIndex.get(element.endNodeId) ?? -1];
  if (!start || !end) throw new FemAnalysisError(`Element ${element.id} references unknown nodes.`);
  const dx = end.xM - start.xM;
  const dy = end.yM - start.yM;
  const lengthM = Math.hypot(dx, dy);
  if (lengthM <= 0) throw new FemAnalysisError(`Element ${element.id} has zero length.`);
  return { lengthM, cos: dx / lengthM, sin: dy / lengthM };
}

function validateInput(input: FemAnalysisInput): void {
  if (input.nodes.length === 0)
    throw new FemAnalysisError("Analysis model must contain at least one node.");
  if (input.elements.length === 0)
    throw new FemAnalysisError("Analysis model must contain at least one element.");
  const nodeIds = new Set<string>();
  for (const node of input.nodes) {
    if (nodeIds.has(node.id)) throw new FemAnalysisError(`Duplicate node id ${node.id}.`);
    nodeIds.add(node.id);
    if (![node.xM, node.yM].every(Number.isFinite))
      throw new FemAnalysisError(`Node ${node.id} has invalid coordinates.`);
  }
  const elementIds = new Set<string>();
  for (const element of input.elements) {
    if (elementIds.has(element.id))
      throw new FemAnalysisError(`Duplicate element id ${element.id}.`);
    elementIds.add(element.id);
    if (!nodeIds.has(element.startNodeId) || !nodeIds.has(element.endNodeId)) {
      throw new FemAnalysisError(`Element ${element.id} references unknown nodes.`);
    }
    if (
      ![element.areaM2, element.inertiaM4, element.elasticModulusPa].every(
        (value) => Number.isFinite(value) && value > 0,
      )
    ) {
      throw new FemAnalysisError(
        `Element ${element.id} has invalid section or material properties.`,
      );
    }
  }
}
