import { describe, expect, it } from "vitest";
import { quantity } from "@/core/quantities";
import { calculateISectionProperties } from "@/core/sections";
import { checkGlobalSteelMember } from "@/core/design";

const sectionGeometry = {
  depth: quantity(600, "mm", "length"),
  flangeWidth: quantity(220, "mm", "length"),
  webThickness: quantity(12, "mm", "length"),
  flangeThickness: quantity(20, "mm", "length"),
};
const sectionProperties = calculateISectionProperties(sectionGeometry);
const grade = {
  id: "S355",
  name: "S355",
  kind: "steel" as const,
  gradeDesignation: "S355",
  elasticModulus: quantity(200000, "MPa", "stress"),
  poissonRatio: 0.3,
  density: { value: 7850, unit: "kg/m³" as const },
  yieldStrength: quantity(355, "MPa", "stress"),
  ultimateStrength: quantity(510, "MPa", "stress"),
  provenance: {
    sourceName: "Benchmark",
    sourceReference: "CBP-D-001",
    revision: "Phase 7.0",
    retrievedAtIso: "2026-01-01T00:00:00.000Z",
    verificationStatus: "verified" as const,
  },
};
const result = checkGlobalSteelMember({
  sectionProperties,
  sectionGeometry,
  steelGrade: grade,
  spanM: 10,
  unbracedLengthM: 10,
  maximumMomentNm: 400000,
  maximumShearN: 120000,
  maximumDeflectionM: 0.012,
  deflectionLimitRatio: 360,
  basis: {
    reference: "User-selected gross-section screening",
    revision: "Phase 7.0",
    resistanceFactor: 1,
  },
});

describe("global steel member screening", () => {
  it("calculates gross section yield capacities without intermediate rounding", () => {
    const flexure = result.checks.find((item) => item.id === "flexure-yield");
    expect(flexure?.capacity).toBeCloseTo(
      grade.yieldStrength.canonicalValue * sectionProperties.plasticModulusX.canonicalValue,
      6,
    );
    expect(flexure?.status).toBe("pass");
  });
  it("applies the supplied deflection limit", () => {
    const deflection = result.checks.find((item) => item.id === "deflection");
    expect(deflection?.capacity).toBeCloseTo(10 / 360, 12);
    expect(deflection?.utilization).toBeCloseTo(0.012 / (10 / 360), 12);
  });
  it("does not manufacture buckling checks without a selected code", () => {
    expect(result.checks.find((item) => item.id === "ltb")?.status).toBe("notEvaluated");
    expect(result.checks.find((item) => item.id === "local-buckling")?.capacity).toBeNull();
  });
});
