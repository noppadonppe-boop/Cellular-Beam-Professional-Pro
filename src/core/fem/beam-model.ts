import type { FemAnalysisInput, FemFrameElement, FemNode } from "@/core/fem/models";
import { FemAnalysisError } from "@/core/fem/models";

export type StraightBeamModelOptions = Readonly<{
  lengthM: number;
  elementCount: number;
  areaM2: number;
  inertiaM4: number;
  elasticModulusPa: number;
}>;

export function createSimplySupportedBeamModel(
  options: StraightBeamModelOptions,
): FemAnalysisInput {
  const nodes = createStraightNodes(options.lengthM, options.elementCount);
  const elements = createStraightElements(nodes, options);
  return {
    nodes,
    elements,
    restraints: [
      { nodeId: firstNode(nodes).id, ux: true, uy: true },
      { nodeId: lastNode(nodes).id, uy: true },
    ],
  };
}

export function createCantileverBeamModel(options: StraightBeamModelOptions): FemAnalysisInput {
  const nodes = createStraightNodes(options.lengthM, options.elementCount);
  const elements = createStraightElements(nodes, options);
  return {
    nodes,
    elements,
    restraints: [{ nodeId: firstNode(nodes).id, ux: true, uy: true, rz: true }],
  };
}

function createStraightNodes(lengthM: number, elementCount: number): FemNode[] {
  if (!Number.isInteger(elementCount) || elementCount < 1)
    throw new RangeError("elementCount must be a positive integer.");
  return Array.from({ length: elementCount + 1 }, (_, index) => ({
    id: `N${String(index + 1)}`,
    xM: (lengthM * index) / elementCount,
    yM: 0,
  }));
}

function createStraightElements(
  nodes: readonly FemNode[],
  options: StraightBeamModelOptions,
): FemFrameElement[] {
  return nodes.slice(0, -1).map((node, index) => ({
    id: `E${String(index + 1)}`,
    startNodeId: node.id,
    endNodeId: nodeAt(nodes, index + 1).id,
    areaM2: options.areaM2,
    inertiaM4: options.inertiaM4,
    elasticModulusPa: options.elasticModulusPa,
  }));
}

function firstNode(nodes: readonly FemNode[]): FemNode {
  return nodeAt(nodes, 0);
}

function lastNode(nodes: readonly FemNode[]): FemNode {
  return nodeAt(nodes, nodes.length - 1);
}

function nodeAt(nodes: readonly FemNode[], index: number): FemNode {
  const node = nodes[index];
  if (!node)
    throw new FemAnalysisError(`Beam model node index ${index.toString()} is not available.`);
  return node;
}
