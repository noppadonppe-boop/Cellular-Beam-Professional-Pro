import type { CanonicalUnitByDimension, Dimension, UnitSymbol } from "@/core/quantities/types";

export const KGF_TO_N = 9.80665;

export type UnitDefinition<D extends Dimension = Dimension> = Readonly<{
  symbol: UnitSymbol;
  dimension: D;
  canonicalUnit: CanonicalUnitByDimension[D];
  toCanonicalFactor: number;
}>;

const definitions = [
  ["1", "scalar", "1", 1],
  ["m", "length", "m", 1],
  ["cm", "length", "m", 1e-2],
  ["mm", "length", "m", 1e-3],
  ["m²", "area", "m²", 1],
  ["cm²", "area", "m²", 1e-4],
  ["mm²", "area", "m²", 1e-6],
  ["m³", "sectionModulus", "m³", 1],
  ["cm³", "sectionModulus", "m³", 1e-6],
  ["mm³", "sectionModulus", "m³", 1e-9],
  ["m⁴", "inertia", "m⁴", 1],
  ["cm⁴", "inertia", "m⁴", 1e-8],
  ["mm⁴", "inertia", "m⁴", 1e-12],
  ["N", "force", "N", 1],
  ["kN", "force", "N", 1e3],
  ["kgf", "force", "N", KGF_TO_N],
  ["tf", "force", "N", KGF_TO_N * 1e3],
  ["N·m", "moment", "N·m", 1],
  ["kN·m", "moment", "N·m", 1e3],
  ["kgf·m", "moment", "N·m", KGF_TO_N],
  ["tf·m", "moment", "N·m", KGF_TO_N * 1e3],
  ["Pa", "stress", "Pa", 1],
  ["MPa", "stress", "Pa", 1e6],
  ["kgf/cm²", "stress", "Pa", KGF_TO_N / 1e-4],
  ["kg", "mass", "kg", 1],
  ["rad", "angle", "rad", 1],
  ["N/m", "distributedLoad", "N/m", 1],
  ["kN/m", "distributedLoad", "N/m", 1e3],
  ["kgf/m", "distributedLoad", "N/m", KGF_TO_N],
  ["tf/m", "distributedLoad", "N/m", KGF_TO_N * 1e3],
  ["kg/m", "linearMass", "kg/m", 1],
] as const satisfies readonly (readonly [UnitSymbol, Dimension, string, number])[];

export const unitRegistry = new Map<UnitSymbol, UnitDefinition>(
  definitions.map(([symbol, dimension, canonicalUnit, toCanonicalFactor]) => [
    symbol,
    { symbol, dimension, canonicalUnit, toCanonicalFactor },
  ]),
);

export function getUnitDefinition(unit: UnitSymbol): UnitDefinition {
  const definition = unitRegistry.get(unit);
  if (!definition) throw new Error(`Unit ${unit} is not registered.`);
  return definition;
}
