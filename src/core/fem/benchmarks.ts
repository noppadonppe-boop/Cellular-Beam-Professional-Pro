import { analyzeLinearFrame2D } from "@/core/fem/solver";
import { createCantileverBeamModel, createSimplySupportedBeamModel } from "@/core/fem/beam-model";

export type FemBenchmark = Readonly<{
  name: string;
  expected: number;
  actual: number;
  unit: string;
  tolerance: number;
  source: string;
}>;

const elasticModulusPa = 200_000_000_000;
const areaM2 = 0.012;
const inertiaM4 = 8.5e-5;

export function runFemBenchmarks(): FemBenchmark[] {
  const pointLoadModel = createSimplySupportedBeamModel({
    lengthM: 10,
    elementCount: 2,
    areaM2,
    inertiaM4,
    elasticModulusPa,
  });
  const pointLoad = 100_000;
  const pointResult = analyzeLinearFrame2D({
    ...pointLoadModel,
    nodalLoads: [{ nodeId: "N2", fyN: -pointLoad }],
  });
  const pointMidspan = pointResult.displacements.find((item) => item.nodeId === "N2")?.uyM ?? 0;
  const leftReaction = pointResult.reactions.find((item) => item.nodeId === "N1")?.fyN ?? 0;

  const uniformModel = createSimplySupportedBeamModel({
    lengthM: 8,
    elementCount: 8,
    areaM2,
    inertiaM4,
    elasticModulusPa,
  });
  const uniformLoad = 18_000;
  const uniformResult = analyzeLinearFrame2D({
    ...uniformModel,
    uniformElementLoads: uniformModel.elements.map((element) => ({
      elementId: element.id,
      localYNPerM: -uniformLoad,
    })),
  });
  const uniformMidspan = uniformResult.displacements.find((item) => item.nodeId === "N5")?.uyM ?? 0;
  const uniformLeftReaction =
    uniformResult.reactions.find((item) => item.nodeId === "N1")?.fyN ?? 0;

  const cantileverModel = createCantileverBeamModel({
    lengthM: 4,
    elementCount: 1,
    areaM2,
    inertiaM4,
    elasticModulusPa,
  });
  const tipLoad = 50_000;
  const cantileverResult = analyzeLinearFrame2D({
    ...cantileverModel,
    nodalLoads: [{ nodeId: "N2", fyN: -tipLoad }],
  });
  const tipDeflection =
    cantileverResult.displacements.find((item) => item.nodeId === "N2")?.uyM ?? 0;
  const fixedMoment = cantileverResult.reactions.find((item) => item.nodeId === "N1")?.mzNm ?? 0;

  return [
    {
      name: "Simply supported centre point load reaction",
      expected: pointLoad / 2,
      actual: leftReaction,
      unit: "N",
      tolerance: 1e-7,
      source: "R = P/2",
    },
    {
      name: "Simply supported centre point load deflection",
      expected: (-pointLoad * 10 ** 3) / (48 * elasticModulusPa * inertiaM4),
      actual: pointMidspan,
      unit: "m",
      tolerance: 1e-12,
      source: "δ = PL³/(48EI)",
    },
    {
      name: "Simply supported UDL reaction",
      expected: (uniformLoad * 8) / 2,
      actual: uniformLeftReaction,
      unit: "N",
      tolerance: 1e-7,
      source: "R = wL/2",
    },
    {
      name: "Simply supported UDL midspan deflection",
      expected: (-5 * uniformLoad * 8 ** 4) / (384 * elasticModulusPa * inertiaM4),
      actual: uniformMidspan,
      unit: "m",
      tolerance: 1e-12,
      source: "δ = 5wL⁴/(384EI)",
    },
    {
      name: "Cantilever tip load deflection",
      expected: (-tipLoad * 4 ** 3) / (3 * elasticModulusPa * inertiaM4),
      actual: tipDeflection,
      unit: "m",
      tolerance: 1e-12,
      source: "δ = PL³/(3EI)",
    },
    {
      name: "Cantilever fixed-end moment",
      expected: tipLoad * 4,
      actual: fixedMoment,
      unit: "N·m",
      tolerance: 1e-7,
      source: "M = PL",
    },
  ];
}
