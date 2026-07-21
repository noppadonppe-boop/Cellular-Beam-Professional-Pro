import { analyzeLinearFrame2D, type FemAnalysisResult } from "@/core/fem";
import { LoadCaseError } from "@/core/loads/models";

export type ContinuousBeamInput = Readonly<{ supportPositionsM: readonly number[]; areaM2: number; inertiaM4: number; elasticModulusPa: number; uniformLoadsNPerM: readonly number[] }>;
export type ContinuousBeamResult = Readonly<{ femResult: FemAnalysisResult; spanLengthsM: readonly number[]; totalLoadN: number; analysisVersion: "continuous-beam-1.0.0" }>;

/** Linear-elastic prismatic continuous beam with vertical supports and free rotations. */
export function analyzeContinuousBeam(input: ContinuousBeamInput): ContinuousBeamResult {
  if (input.supportPositionsM.length < 3) throw new LoadCaseError("A continuous beam requires at least three supports.");
  if (input.uniformLoadsNPerM.length !== input.supportPositionsM.length - 1) throw new LoadCaseError("Provide one uniform load per span.");
  if (![input.areaM2, input.inertiaM4, input.elasticModulusPa, ...input.supportPositionsM, ...input.uniformLoadsNPerM].every(Number.isFinite)) throw new LoadCaseError("Continuous beam input contains non-finite values.");
  const spanLengths = input.supportPositionsM.slice(1).map((position, index) => position - (input.supportPositionsM[index] ?? 0));
  if (spanLengths.some((length) => length <= 0) || input.areaM2 <= 0 || input.inertiaM4 <= 0 || input.elasticModulusPa <= 0) throw new LoadCaseError("Supports must be strictly increasing and section values positive.");
  const nodes = input.supportPositionsM.map((xM, index) => ({ id: `S${String(index + 1)}`, xM, yM: 0 }));
  const elements = spanLengths.map((_, index) => ({ id: `E${String(index + 1)}`, startNodeId: `S${String(index + 1)}`, endNodeId: `S${String(index + 2)}`, areaM2: input.areaM2, inertiaM4: input.inertiaM4, elasticModulusPa: input.elasticModulusPa }));
  const femResult = analyzeLinearFrame2D({ nodes, elements, restraints: nodes.map((node, index) => ({ nodeId: node.id, ux: index === 0, uy: true })), uniformElementLoads: input.uniformLoadsNPerM.map((localYNPerM, index) => ({ elementId: `E${String(index + 1)}`, localYNPerM })) });
  return { femResult, spanLengthsM: spanLengths, totalLoadN: spanLengths.reduce((sum, length, index) => sum + length * (input.uniformLoadsNPerM[index] ?? 0), 0), analysisVersion: "continuous-beam-1.0.0" };
}
export function createPhase10BenchmarkContinuousBeam(): ContinuousBeamInput { return { supportPositionsM: [0, 6, 12], areaM2: 0.012, inertiaM4: 8.5e-5, elasticModulusPa: 200_000_000_000, uniformLoadsNPerM: [-20000, -20000] }; }
