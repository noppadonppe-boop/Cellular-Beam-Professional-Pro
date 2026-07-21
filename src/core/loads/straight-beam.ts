import { analyzeLinearFrame2D, type FemAnalysisInput, type FemAnalysisResult } from "@/core/fem";
import type {
  DiagramExtrema,
  DiagramSample,
  PointLoad,
  StraightBeamAnalysis,
  StraightBeamAnalysisInput,
  StraightBeamLoadCase,
  UniformLoad,
} from "@/core/loads/models";
import { LoadCaseError } from "@/core/loads/models";

const GRAVITY_M_PER_S2 = 9.80665;
const POSITION_TOLERANCE_M = 1e-9;

type AnalysisModel = Readonly<{
  femInput: FemAnalysisInput;
  pointLoads: readonly PointLoad[];
  uniformLoads: readonly UniformLoad[];
}>;

export function analyzeStraightBeamLoadCase(
  input: StraightBeamAnalysisInput,
): StraightBeamAnalysis {
  validateStraightBeamAnalysisInput(input);
  const model = buildSimplySupportedModel(input);
  const femResult = analyzeLinearFrame2D(model.femInput);
  const samples = sampleDiagrams(input.beamLengthM, model, femResult);
  return {
    femInput: model.femInput,
    femResult,
    samples,
    extrema: getDiagramExtrema(samples),
    totalVerticalLoadN: getTotalVerticalLoad(
      input.beamLengthM,
      model.pointLoads,
      model.uniformLoads,
    ),
    loadCase: input.loadCase,
    analysisVersion: "straight-load-diagrams-1.0.0",
  };
}

export function createPhase6BenchmarkLoadCase(): StraightBeamLoadCase {
  return {
    id: "LC-SERVICE-001",
    name: "Service gravity benchmark",
    category: "dead",
    direction: "gravity",
    includeSelfWeight: true,
    source: "benchmark",
    revision: "Phase 6.0",
    loads: [
      {
        id: "SDL-UDL-001",
        type: "uniform",
        startXM: 0,
        endXM: 10,
        magnitudeNPerM: -12_000,
        label: "Superimposed dead load",
      },
      {
        id: "MEP-POINT-001",
        type: "point",
        positionXM: 5,
        fyN: -40_000,
        label: "Central MEP point load",
      },
    ],
  };
}

export function getTotalVerticalLoad(
  beamLengthM: number,
  pointLoads: readonly PointLoad[],
  uniformLoads: readonly UniformLoad[],
): number {
  const pointLoadSum = pointLoads.reduce((sum, load) => sum + load.fyN, 0);
  const uniformLoadSum = uniformLoads.reduce(
    (sum, load) => sum + load.magnitudeNPerM * (load.endXM - load.startXM),
    0,
  );
  if (!Number.isFinite(beamLengthM) || beamLengthM <= 0)
    throw new LoadCaseError("Beam length must be positive.");
  return pointLoadSum + uniformLoadSum;
}

function buildSimplySupportedModel(input: StraightBeamAnalysisInput): AnalysisModel {
  const uniformLoads = [
    ...input.loadCase.loads.filter((load): load is UniformLoad => load.type === "uniform"),
  ];
  const pointLoads = [
    ...input.loadCase.loads.filter((load): load is PointLoad => load.type === "point"),
  ];
  if (input.loadCase.includeSelfWeight) {
    uniformLoads.push({
      id: "AUTO-SW",
      type: "uniform",
      startXM: 0,
      endXM: input.beamLengthM,
      magnitudeNPerM: -input.areaM2 * input.steelDensityKgM3 * GRAVITY_M_PER_S2,
      label: "Automatic self-weight",
    });
  }

  const breakpoints = getBreakpoints(
    input.beamLengthM,
    input.minimumElementCount ?? 20,
    pointLoads,
    uniformLoads,
  );
  const nodes = breakpoints.map((xM, index) => ({ id: `N${String(index + 1)}`, xM, yM: 0 }));
  const elements = nodes.slice(0, -1).map((node, index) => ({
    id: `E${String(index + 1)}`,
    startNodeId: node.id,
    endNodeId: readNode(nodes, index + 1).id,
    areaM2: input.areaM2,
    inertiaM4: input.inertiaM4,
    elasticModulusPa: input.elasticModulusPa,
  }));
  const nodalLoads = pointLoads.map((load) => ({
    nodeId: getNodeIdAtPosition(nodes, load.positionXM),
    fyN: load.fyN,
  }));
  const uniformElementLoads = elements
    .map((element, index) => {
      const start = readNode(nodes, index).xM;
      const end = readNode(nodes, index + 1).xM;
      const mid = (start + end) / 2;
      const localYNPerM = uniformLoads
        .filter(
          (load) =>
            mid >= load.startXM - POSITION_TOLERANCE_M && mid <= load.endXM + POSITION_TOLERANCE_M,
        )
        .reduce((sum, load) => sum + load.magnitudeNPerM, 0);
      return { elementId: element.id, localYNPerM };
    })
    .filter((load) => load.localYNPerM !== 0);

  return {
    femInput: {
      nodes,
      elements,
      restraints: [
        { nodeId: readNode(nodes, 0).id, ux: true, uy: true },
        { nodeId: readNode(nodes, nodes.length - 1).id, uy: true },
      ],
      nodalLoads,
      uniformElementLoads,
    },
    pointLoads,
    uniformLoads,
  };
}

function sampleDiagrams(
  beamLengthM: number,
  model: AnalysisModel,
  femResult: FemAnalysisResult,
): DiagramSample[] {
  const samplePositions = getSamplePositions(beamLengthM, 80, model.pointLoads, model.uniformLoads);
  return samplePositions.map((xM) => {
    const displacement = interpolateDisplacement(model.femInput, femResult, xM);
    return {
      xM,
      axialN: 0,
      shearN: getShearAt(xM, femResult, model.pointLoads, model.uniformLoads),
      momentNm: getMomentAt(xM, femResult, model.pointLoads, model.uniformLoads),
      deflectionM: displacement.deflectionM,
      rotationRad: displacement.rotationRad,
    };
  });
}

function getShearAt(
  xM: number,
  femResult: FemAnalysisResult,
  pointLoads: readonly PointLoad[],
  uniformLoads: readonly UniformLoad[],
): number {
  const leftReaction = femResult.reactions.find((reaction) => reaction.nodeId === "N1")?.fyN ?? 0;
  const pointContribution = pointLoads
    .filter((load) => load.positionXM <= xM + POSITION_TOLERANCE_M)
    .reduce((sum, load) => sum + load.fyN, 0);
  const uniformContribution = uniformLoads.reduce((sum, load) => {
    const loadedLength = Math.max(0, Math.min(xM, load.endXM) - load.startXM);
    return sum + load.magnitudeNPerM * loadedLength;
  }, 0);
  return leftReaction + pointContribution + uniformContribution;
}

function getMomentAt(
  xM: number,
  femResult: FemAnalysisResult,
  pointLoads: readonly PointLoad[],
  uniformLoads: readonly UniformLoad[],
): number {
  const leftReaction = femResult.reactions.find((reaction) => reaction.nodeId === "N1")?.fyN ?? 0;
  const pointContribution = pointLoads
    .filter((load) => load.positionXM <= xM + POSITION_TOLERANCE_M)
    .reduce((sum, load) => sum + load.fyN * (xM - load.positionXM), 0);
  const uniformContribution = uniformLoads.reduce((sum, load) => {
    const loadedLength = Math.max(0, Math.min(xM, load.endXM) - load.startXM);
    return sum + load.magnitudeNPerM * loadedLength * (xM - load.startXM - loadedLength / 2);
  }, 0);
  return leftReaction * xM + pointContribution + uniformContribution;
}

function interpolateDisplacement(
  femInput: FemAnalysisInput,
  femResult: FemAnalysisResult,
  xM: number,
): Readonly<{ deflectionM: number; rotationRad: number }> {
  const elementIndex = Math.min(
    Math.max(
      femInput.elements.findIndex((element) => {
        const start = femInput.nodes.find((node) => node.id === element.startNodeId);
        const end = femInput.nodes.find((node) => node.id === element.endNodeId);
        if (!start || !end) return false;
        return xM >= start.xM - POSITION_TOLERANCE_M && xM <= end.xM + POSITION_TOLERANCE_M;
      }),
      0,
    ),
    femInput.elements.length - 1,
  );
  const element = femInput.elements[elementIndex];
  if (!element) throw new LoadCaseError("Cannot interpolate displacement without an element.");
  const startNode = femInput.nodes.find((node) => node.id === element.startNodeId);
  const endNode = femInput.nodes.find((node) => node.id === element.endNodeId);
  if (!startNode || !endNode)
    throw new LoadCaseError("Cannot interpolate displacement for missing element nodes.");
  const startDisp = femResult.displacements.find((item) => item.nodeId === startNode.id);
  const endDisp = femResult.displacements.find((item) => item.nodeId === endNode.id);
  if (!startDisp || !endDisp)
    throw new LoadCaseError("Cannot interpolate displacement for missing node results.");
  const lengthM = endNode.xM - startNode.xM;
  const xi = lengthM === 0 ? 0 : (xM - startNode.xM) / lengthM;
  const n1 = 1 - 3 * xi ** 2 + 2 * xi ** 3;
  const n2 = lengthM * (xi - 2 * xi ** 2 + xi ** 3);
  const n3 = 3 * xi ** 2 - 2 * xi ** 3;
  const n4 = lengthM * (-(xi ** 2) + xi ** 3);
  const dn1 = (-6 * xi + 6 * xi ** 2) / lengthM;
  const dn2 = 1 - 4 * xi + 3 * xi ** 2;
  const dn3 = (6 * xi - 6 * xi ** 2) / lengthM;
  const dn4 = -2 * xi + 3 * xi ** 2;
  return {
    deflectionM: n1 * startDisp.uyM + n2 * startDisp.rzRad + n3 * endDisp.uyM + n4 * endDisp.rzRad,
    rotationRad:
      dn1 * startDisp.uyM + dn2 * startDisp.rzRad + dn3 * endDisp.uyM + dn4 * endDisp.rzRad,
  };
}

function getDiagramExtrema(samples: readonly DiagramSample[]): DiagramExtrema {
  return {
    maxShearN: maxBy(samples, (sample) => sample.shearN),
    minShearN: minBy(samples, (sample) => sample.shearN),
    maxMomentNm: maxBy(samples, (sample) => sample.momentNm),
    minMomentNm: minBy(samples, (sample) => sample.momentNm),
    maxDeflectionM: maxBy(samples, (sample) => sample.deflectionM),
    minDeflectionM: minBy(samples, (sample) => sample.deflectionM),
  };
}

function getBreakpoints(
  beamLengthM: number,
  minimumElementCount: number,
  pointLoads: readonly PointLoad[],
  uniformLoads: readonly UniformLoad[],
): number[] {
  const positions = new Set<number>();
  for (let index = 0; index <= minimumElementCount; index += 1) {
    positions.add(roundPosition((beamLengthM * index) / minimumElementCount));
  }
  for (const load of pointLoads) positions.add(roundPosition(load.positionXM));
  for (const load of uniformLoads) {
    positions.add(roundPosition(load.startXM));
    positions.add(roundPosition(load.endXM));
  }
  return [...positions].sort((a, b) => a - b);
}

function getSamplePositions(
  beamLengthM: number,
  minimumSampleCount: number,
  pointLoads: readonly PointLoad[],
  uniformLoads: readonly UniformLoad[],
): number[] {
  const positions = getBreakpoints(beamLengthM, minimumSampleCount, pointLoads, uniformLoads);
  for (const load of pointLoads) {
    positions.push(roundPosition(Math.max(0, load.positionXM - 1e-6)));
    positions.push(roundPosition(Math.min(beamLengthM, load.positionXM + 1e-6)));
  }
  return [...new Set(positions)].sort((a, b) => a - b);
}

function getNodeIdAtPosition(
  nodes: readonly { id: string; xM: number }[],
  positionXM: number,
): string {
  const node = nodes.find((item) => Math.abs(item.xM - positionXM) <= POSITION_TOLERANCE_M);
  if (!node) throw new LoadCaseError(`No analysis node exists at x = ${positionXM.toString()} m.`);
  return node.id;
}

function readNode<T>(nodes: readonly T[], index: number): T {
  const node = nodes[index];
  if (!node) throw new LoadCaseError(`Node index ${index.toString()} is not available.`);
  return node;
}

function maxBy(
  samples: readonly DiagramSample[],
  selector: (sample: DiagramSample) => number,
): DiagramSample {
  const first = samples[0];
  if (!first) throw new LoadCaseError("Cannot find extrema without diagram samples.");
  return samples.reduce(
    (best, sample) => (selector(sample) > selector(best) ? sample : best),
    first,
  );
}

function minBy(
  samples: readonly DiagramSample[],
  selector: (sample: DiagramSample) => number,
): DiagramSample {
  const first = samples[0];
  if (!first) throw new LoadCaseError("Cannot find extrema without diagram samples.");
  return samples.reduce(
    (best, sample) => (selector(sample) < selector(best) ? sample : best),
    first,
  );
}

function roundPosition(value: number): number {
  return Math.round(value * 1e9) / 1e9;
}

function validateStraightBeamAnalysisInput(input: StraightBeamAnalysisInput): void {
  if (
    ![
      input.beamLengthM,
      input.areaM2,
      input.inertiaM4,
      input.elasticModulusPa,
      input.steelDensityKgM3,
    ].every(Number.isFinite)
  ) {
    throw new LoadCaseError("Straight beam load analysis input contains non-finite values.");
  }
  if (
    input.beamLengthM <= 0 ||
    input.areaM2 <= 0 ||
    input.inertiaM4 <= 0 ||
    input.elasticModulusPa <= 0
  ) {
    throw new LoadCaseError(
      "Straight beam analysis geometry and material values must be positive.",
    );
  }
  for (const load of input.loadCase.loads) {
    if (load.type === "point") {
      if (load.positionXM < 0 || load.positionXM > input.beamLengthM) {
        throw new LoadCaseError(`Point load ${load.id} is outside the beam span.`);
      }
      if (!Number.isFinite(load.fyN))
        throw new LoadCaseError(`Point load ${load.id} has an invalid force.`);
    }
    if (load.type === "uniform") {
      if (load.startXM < 0 || load.endXM > input.beamLengthM || load.endXM <= load.startXM) {
        throw new LoadCaseError(`Uniform load ${load.id} has invalid start or end coordinates.`);
      }
      if (!Number.isFinite(load.magnitudeNPerM)) {
        throw new LoadCaseError(`Uniform load ${load.id} has an invalid magnitude.`);
      }
    }
  }
}
