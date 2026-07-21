import type { AreaQuantity, LengthQuantity, LinearMassQuantity, Quantity } from "@/core/quantities";
import type { DataProvenance } from "@/core/materials/models";

export type ISectionGeometry = Readonly<{
  depth: LengthQuantity;
  flangeWidth: LengthQuantity;
  webThickness: LengthQuantity;
  flangeThickness: LengthQuantity;
  rootRadius?: LengthQuantity;
}>;

export type SectionProperties = Readonly<{
  area: AreaQuantity;
  centroidFromBottom: LengthQuantity;
  ix: Quantity<"inertia">;
  iy: Quantity<"inertia">;
  elasticModulusX: Quantity<"sectionModulus">;
  elasticModulusY: Quantity<"sectionModulus">;
  plasticModulusX: Quantity<"sectionModulus">;
  plasticModulusY: Quantity<"sectionModulus">;
  massPerMetre: LinearMassQuantity;
}>;

export type SectionRecord = Readonly<{
  id: string;
  designation: string;
  sectionType: "i-section";
  geometry: ISectionGeometry;
  properties: SectionProperties;
  steelDensity: Readonly<{ value: number; unit: "kg/m³" }>;
  provenance: DataProvenance;
  createdAtIso: string;
  updatedAtIso: string;
}>;

export type SectionPropertyComparison = Readonly<{
  property: keyof SectionProperties;
  calculatedValue: number;
  catalogueValue: number;
  relativeDifference: number;
  withinTolerance: boolean;
}>;
