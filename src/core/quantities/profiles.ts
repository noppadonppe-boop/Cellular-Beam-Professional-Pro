import type { Dimension, UnitSymbol } from "@/core/quantities/types";

export type DisplayProfile = Readonly<{
  id: string;
  name: string;
  units: Partial<Record<Dimension, UnitSymbol>>;
}>;

export const thaiEngineeringMetricProfile: DisplayProfile = {
  id: "thai-engineering-metric",
  name: "Thai Engineering Metric",
  units: {
    length: "mm",
    area: "cm²",
    force: "kN",
    moment: "kN·m",
    stress: "MPa",
    distributedLoad: "kN/m",
    linearMass: "kg/m",
    inertia: "cm⁴",
    sectionModulus: "cm³",
    angle: "rad",
    mass: "kg",
  },
};

export const siDisplayProfile: DisplayProfile = {
  id: "si-engineering",
  name: "SI Engineering",
  units: {
    length: "m",
    area: "m²",
    force: "N",
    moment: "N·m",
    stress: "Pa",
    distributedLoad: "N/m",
    linearMass: "kg/m",
    inertia: "m⁴",
    sectionModulus: "m³",
    angle: "rad",
    mass: "kg",
  },
};
