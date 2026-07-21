import { describe, expect, expectTypeOf, it } from "vitest";
import {
  convert,
  formatEngineering,
  quantity,
  roundToSignificantFigures,
  type ForceQuantity,
  type MassQuantity,
} from "@/core/quantities";

describe("engineering quantities and conversion registry", () => {
  it("converts kgf to N using the standard gravity constant", () =>
    expect(quantity(1, "kgf", "force").canonicalValue).toBeCloseTo(9.80665, 12));
  it("converts ton-force to kN", () =>
    expect(convert(quantity(1, "tf", "force"), "kN")).toBeCloseTo(9.80665, 12));
  it("converts kgf/cm² to MPa", () =>
    expect(convert(quantity(1, "kgf/cm²", "stress"), "MPa")).toBeCloseTo(0.0980665, 12));
  it("converts kN·m to kgf·m", () =>
    expect(convert(quantity(1, "kN·m", "moment"), "kgf·m")).toBeCloseTo(101.9716212978, 9));
  it("converts mm to canonical metres", () =>
    expect(quantity(1, "mm", "length").canonicalValue).toBe(0.001));
  it("round-trips without changing the canonical value", () => {
    const initial = quantity(12.345, "tf", "force");
    const displayed = convert(initial, "kgf");
    expect(quantity(displayed, "kgf", "force").canonicalValue).toBeCloseTo(
      initial.canonicalValue,
      10,
    );
  });
  it("rejects incompatible dimensions", () =>
    expect(() => convert(quantity(1, "N", "force"), "kg")).toThrow(/Incompatible dimensions/));
  it("keeps force and mass as distinct compile-time types", () => {
    expectTypeOf<ForceQuantity>().not.toEqualTypeOf<MassQuantity>();
  });
  it("rounds only when formatting", () => {
    const source = quantity(1234.56789, "N", "force");
    expect(source.canonicalValue).toBe(1234.56789);
    expect(roundToSignificantFigures(source.canonicalValue, 4)).toBe(1235);
    expect(formatEngineering(source, "kN", { significantFigures: 4 })).toBe("1.235 kN");
  });
});
