export const dimensions = [
  "scalar",
  "length",
  "area",
  "force",
  "moment",
  "stress",
  "mass",
  "angle",
  "distributedLoad",
  "linearMass",
  "inertia",
  "sectionModulus",
] as const;

export type Dimension = (typeof dimensions)[number];

export type CanonicalUnitByDimension = {
  scalar: "1";
  length: "m";
  area: "m²";
  force: "N";
  moment: "N·m";
  stress: "Pa";
  mass: "kg";
  angle: "rad";
  distributedLoad: "N/m";
  linearMass: "kg/m";
  inertia: "m⁴";
  sectionModulus: "m³";
};

export type UnitSymbol =
  | "1"
  | "m"
  | "cm"
  | "mm"
  | "m²"
  | "cm²"
  | "mm²"
  | "m³"
  | "cm³"
  | "mm³"
  | "m⁴"
  | "cm⁴"
  | "mm⁴"
  | "N"
  | "kN"
  | "kgf"
  | "tf"
  | "N·m"
  | "kN·m"
  | "kgf·m"
  | "tf·m"
  | "Pa"
  | "MPa"
  | "kgf/cm²"
  | "kg"
  | "rad"
  | "N/m"
  | "kN/m"
  | "kgf/m"
  | "tf/m"
  | "kg/m";

export type Quantity<D extends Dimension> = Readonly<{
  dimension: D;
  rawValue: number;
  displayUnit: UnitSymbol;
  canonicalValue: number;
  canonicalUnit: CanonicalUnitByDimension[D];
}>;

export type LengthQuantity = Quantity<"length">;
export type AreaQuantity = Quantity<"area">;
export type ForceQuantity = Quantity<"force">;
export type MomentQuantity = Quantity<"moment">;
export type StressQuantity = Quantity<"stress">;
export type MassQuantity = Quantity<"mass">;
export type LinearMassQuantity = Quantity<"linearMass">;

export class IncompatibleDimensionError extends Error {
  public constructor(expected: Dimension, actual: Dimension) {
    super(`Incompatible dimensions: expected ${expected}, received ${actual}.`);
    this.name = "IncompatibleDimensionError";
  }
}
