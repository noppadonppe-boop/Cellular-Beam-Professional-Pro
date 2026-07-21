import { describe, expect, it } from "vitest";
import { generateCellularGeometry, type CellularGeometryInput } from "@/core/cellular";

const validInput: CellularGeometryInput = {
  beamLengthMm: 12000,
  parentDepthMm: 400,
  flangeWidthMm: 200,
  flangeThicknessMm: 16,
  webThicknessMm: 10,
  finishedDepthMm: 600,
  openingDiameterMm: 400,
  pitchMm: 600,
  firstOpeningCenterMm: 700,
  openingCount: 18,
  openingEccentricityMm: 0,
  minimumSolidEndZoneMm: 400,
  steelDensityKgM3: 7850,
  weldSizeMm: 6,
  cuttingPattern: "circular-interlock",
  weldType: "continuous-fillet",
};

describe("cellular geometry generator", () => {
  it("generates deterministic opening coordinates and web posts", () => {
    const result = generateCellularGeometry(validInput);
    expect(result.isValid).toBe(true);
    expect(result.openings).toHaveLength(18);
    expect(result.webPosts).toHaveLength(17);
    expect(result.openings[0]?.centerXM).toBeCloseTo(0.7, 12);
    expect(result.openings.at(-1)?.centerXM).toBeCloseTo(10.9, 12);
    expect(result.webPosts[0]?.clearWidthM).toBeCloseTo(0.2, 12);
  });

  it("calculates symmetric tee geometry and net area", () => {
    const result = generateCellularGeometry(validInput);
    expect(result.topTee.depthM).toBeCloseTo(0.1, 12);
    expect(result.bottomTee.depthM).toBeCloseTo(0.1, 12);
    expect(result.netAreaAtOpeningM2).toBeCloseTo(0.00808, 12);
  });

  it("detects overlapping openings", () => {
    const result = generateCellularGeometry({ ...validInput, pitchMm: 400 });
    expect(result.isValid).toBe(false);
    expect(result.issues).toContainEqual(expect.objectContaining({ code: "OVERLAPPING_OPENINGS" }));
  });

  it("detects openings inside protected end zones", () => {
    const result = generateCellularGeometry({ ...validInput, firstOpeningCenterMm: 500 });
    expect(result.isValid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ code: "END_ZONE", openingNumber: 1 }),
    );
  });

  it("does not round intermediate geometry", () => {
    const result = generateCellularGeometry({ ...validInput, pitchMm: 603.7, openingCount: 2 });
    expect(result.openings[1]?.centerXM).toBeCloseTo(1.3037, 14);
  });

  it("reports unequal tees for eccentric openings", () => {
    const result = generateCellularGeometry({ ...validInput, openingEccentricityMm: 10 });
    expect(result.topTee.depthM).toBeCloseTo(0.09, 12);
    expect(result.bottomTee.depthM).toBeCloseTo(0.11, 12);
    expect(result.issues).toContainEqual(
      expect.objectContaining({ code: "ASYMMETRIC_TEE", severity: "warning" }),
    );
  });
});
