import { describe, expect, it } from "vitest";
import { quantity } from "@/core/quantities";
import { calculateISectionProperties, compareProperty } from "@/core/sections/calculator";
import type { ISectionGeometry } from "@/core/sections/models";

const geometry: ISectionGeometry = {
  depth: quantity(300, "mm", "length"),
  flangeWidth: quantity(150, "mm", "length"),
  webThickness: quantity(6.5, "mm", "length"),
  flangeThickness: quantity(9, "mm", "length"),
};
const result = calculateISectionProperties(geometry);

describe("symmetric I-section property calculator", () => {
  it("calculates area", () => expect(result.area.canonicalValue).toBeCloseTo(0.004533, 12));
  it("calculates centroid from bottom", () =>
    expect(result.centroidFromBottom.canonicalValue).toBeCloseTo(0.15, 12));
  it("calculates Ix", () => expect(result.ix.canonicalValue).toBeCloseTo(0.000069325191, 12));
  it("calculates Iy", () => expect(result.iy.canonicalValue).toBeCloseTo(0.0000050689536875, 14));
  it("calculates elastic section modulus about x", () =>
    expect(result.elasticModulusX.canonicalValue).toBeCloseTo(0.00046216794, 12));
  it("calculates elastic section modulus about y", () =>
    expect(result.elasticModulusY.canonicalValue).toBeCloseTo(0.0000675860491667, 14));
  it("calculates plastic section modulus about x", () =>
    expect(result.plasticModulusX.canonicalValue).toBeCloseTo(0.0005220765, 12));
  it("calculates plastic section modulus about y", () =>
    expect(result.plasticModulusY.canonicalValue).toBeCloseTo(0.000104228625, 12));
  it("calculates mass per metre", () =>
    expect(result.massPerMetre.canonicalValue).toBeCloseTo(35.58405, 9));
  it("evaluates comparison tolerance", () => {
    expect(compareProperty("area", 100.4, 100, 0.005).withinTolerance).toBe(true);
    expect(compareProperty("area", 100.6, 100, 0.005).withinTolerance).toBe(false);
  });
  it("rejects invalid geometry", () =>
    expect(() =>
      calculateISectionProperties({ ...geometry, flangeThickness: quantity(151, "mm", "length") }),
    ).toThrow());
});
