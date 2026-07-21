import { describe, expect, it } from "vitest";
import {
  analyzeStraightBeamLoadCase,
  createPhase6BenchmarkLoadCase,
  LoadCaseError,
  runLoadDiagramBenchmarks,
  type StraightBeamLoadCase,
} from "@/core/loads";

const baseInput = {
  beamLengthM: 10,
  areaM2: 0.012,
  inertiaM4: 8.5e-5,
  elasticModulusPa: 200_000_000_000,
  steelDensityKgM3: 7850,
};

describe("straight beam load cases and diagrams", () => {
  it("converts a centre point load into a split-node FEM model", () => {
    const loadCase: StraightBeamLoadCase = {
      id: "LC-P",
      name: "Point load",
      category: "live",
      direction: "gravity",
      includeSelfWeight: false,
      source: "benchmark",
      revision: "test",
      loads: [{ id: "P", type: "point", positionXM: 5, fyN: -100_000, label: "Centre point" }],
    };

    const result = analyzeStraightBeamLoadCase({ ...baseInput, loadCase, minimumElementCount: 2 });

    expect(result.femInput.nodes.map((node) => node.xM)).toEqual([0, 5, 10]);
    expect(result.totalVerticalLoadN).toBe(-100_000);
    expect(result.extrema.maxMomentNm.momentNm).toBeCloseTo(250_000, 7);
    expect(result.extrema.minDeflectionM.deflectionM).toBeCloseTo(
      (-100_000 * 10 ** 3) / (48 * baseInput.elasticModulusPa * baseInput.inertiaM4),
      12,
    );
  });

  it("matches closed-form UDL shear and bending moment diagrams", () => {
    const loadCase: StraightBeamLoadCase = {
      id: "LC-UDL",
      name: "UDL",
      category: "dead",
      direction: "gravity",
      includeSelfWeight: false,
      source: "benchmark",
      revision: "test",
      loads: [
        { id: "W", type: "uniform", startXM: 0, endXM: 10, magnitudeNPerM: -18_000, label: "UDL" },
      ],
    };

    const result = analyzeStraightBeamLoadCase({ ...baseInput, loadCase, minimumElementCount: 10 });

    expect(result.totalVerticalLoadN).toBe(-180_000);
    expect(result.extrema.maxShearN.shearN).toBeCloseTo(90_000, 7);
    expect(result.extrema.minShearN.shearN).toBeCloseTo(-90_000, 7);
    expect(result.extrema.maxMomentNm.momentNm).toBeCloseTo(225_000, 6);
  });

  it("adds automatic steel self-weight as a uniform gravity load", () => {
    const result = analyzeStraightBeamLoadCase({
      ...baseInput,
      loadCase: createPhase6BenchmarkLoadCase(),
      minimumElementCount: 20,
    });

    const selfWeight =
      -baseInput.areaM2 * baseInput.steelDensityKgM3 * 9.80665 * baseInput.beamLengthM;
    expect(result.totalVerticalLoadN).toBeCloseTo(-160_000 + selfWeight, 9);
  });

  it("rejects uniform loads outside the beam span", () => {
    const loadCase: StraightBeamLoadCase = {
      id: "LC-BAD",
      name: "Bad load",
      category: "userDefined",
      direction: "gravity",
      includeSelfWeight: false,
      source: "userDefined",
      revision: "test",
      loads: [
        {
          id: "W",
          type: "uniform",
          startXM: 0,
          endXM: 12,
          magnitudeNPerM: -10_000,
          label: "Bad UDL",
        },
      ],
    };

    expect(() => analyzeStraightBeamLoadCase({ ...baseInput, loadCase })).toThrow(LoadCaseError);
  });

  it("keeps runtime load diagram benchmarks passing", () => {
    for (const benchmark of runLoadDiagramBenchmarks()) {
      expect(Math.abs(benchmark.actual - benchmark.expected)).toBeLessThanOrEqual(
        benchmark.tolerance,
      );
    }
  });
});
