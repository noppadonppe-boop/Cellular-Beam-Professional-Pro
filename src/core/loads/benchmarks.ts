import { analyzeStraightBeamLoadCase } from "@/core/loads/straight-beam";
import type { StraightBeamLoadCase } from "@/core/loads/models";

export type LoadDiagramBenchmark = Readonly<{
  name: string;
  expected: number;
  actual: number;
  unit: string;
  tolerance: number;
  source: string;
}>;

const section = {
  beamLengthM: 10,
  areaM2: 0.012,
  inertiaM4: 8.5e-5,
  elasticModulusPa: 200_000_000_000,
  steelDensityKgM3: 7850,
};

export function runLoadDiagramBenchmarks(): LoadDiagramBenchmark[] {
  const udl = -18_000;
  const udlCase: StraightBeamLoadCase = {
    id: "LC-BENCH-UDL",
    name: "UDL benchmark",
    category: "dead",
    direction: "gravity",
    includeSelfWeight: false,
    source: "benchmark",
    revision: "Phase 6.0",
    loads: [{ id: "UDL", type: "uniform", startXM: 0, endXM: 10, magnitudeNPerM: udl, label: "UDL" }],
  };
  const udlResult = analyzeStraightBeamLoadCase({ ...section, loadCase: udlCase, minimumElementCount: 10 });

  const pointLoad = -100_000;
  const pointCase: StraightBeamLoadCase = {
    id: "LC-BENCH-POINT",
    name: "Centre point load benchmark",
    category: "live",
    direction: "gravity",
    includeSelfWeight: false,
    source: "benchmark",
    revision: "Phase 6.0",
    loads: [{ id: "P", type: "point", positionXM: 5, fyN: pointLoad, label: "Centre point load" }],
  };
  const pointResult = analyzeStraightBeamLoadCase({ ...section, loadCase: pointCase, minimumElementCount: 10 });

  return [
    {
      name: "Load case total UDL",
      expected: udl * 10,
      actual: udlResult.totalVerticalLoadN,
      unit: "N",
      tolerance: 1e-9,
      source: "ΣwL",
    },
    {
      name: "UDL shear at left support",
      expected: Math.abs(udl) * 10 / 2,
      actual: udlResult.extrema.maxShearN.shearN,
      unit: "N",
      tolerance: 1e-7,
      source: "Vmax = wL/2",
    },
    {
      name: "UDL max moment",
      expected: Math.abs(udl) * 10 ** 2 / 8,
      actual: udlResult.extrema.maxMomentNm.momentNm,
      unit: "N·m",
      tolerance: 1e-7,
      source: "Mmax = wL²/8",
    },
    {
      name: "Point load total",
      expected: pointLoad,
      actual: pointResult.totalVerticalLoadN,
      unit: "N",
      tolerance: 1e-9,
      source: "ΣP",
    },
    {
      name: "Point load max moment",
      expected: Math.abs(pointLoad) * 10 / 4,
      actual: pointResult.extrema.maxMomentNm.momentNm,
      unit: "N·m",
      tolerance: 1e-7,
      source: "Mmax = PL/4",
    },
    {
      name: "Point load max deflection",
      expected: (pointLoad * 10 ** 3) / (48 * section.elasticModulusPa * section.inertiaM4),
      actual: pointResult.extrema.minDeflectionM.deflectionM,
      unit: "m",
      tolerance: 1e-12,
      source: "δ = PL³/(48EI)",
    },
  ];
}
