import { quantity } from "@/core/quantities";
import type {
  ISectionGeometry,
  SectionProperties,
  SectionPropertyComparison,
} from "@/core/sections/models";

export const DEFAULT_STEEL_DENSITY_KG_PER_M3 = 7850;

export function calculateISectionProperties(
  geometry: ISectionGeometry,
  steelDensity = DEFAULT_STEEL_DENSITY_KG_PER_M3,
): SectionProperties {
  const d = geometry.depth.canonicalValue;
  const bf = geometry.flangeWidth.canonicalValue;
  const tw = geometry.webThickness.canonicalValue;
  const tf = geometry.flangeThickness.canonicalValue;
  if (d <= 0 || bf <= 0 || tw <= 0 || tf <= 0)
    throw new RangeError("I-section dimensions must be greater than zero.");
  if (2 * tf >= d)
    throw new RangeError("Twice the flange thickness must be less than the overall depth.");
  if (tw > bf) throw new RangeError("Web thickness cannot exceed flange width.");

  const webHeight = d - 2 * tf;
  const flangeArea = bf * tf;
  const webArea = tw * webHeight;
  const area = 2 * flangeArea + webArea;
  const centroid = d / 2;
  const flangeCentroidOffset = d / 2 - tf / 2;
  const ix =
    2 * ((bf * tf ** 3) / 12 + flangeArea * flangeCentroidOffset ** 2) + (tw * webHeight ** 3) / 12;
  const iy = 2 * ((tf * bf ** 3) / 12) + (webHeight * tw ** 3) / 12;
  const elasticModulusX = ix / (d / 2);
  const elasticModulusY = iy / (bf / 2);
  const plasticModulusX =
    2 * (flangeArea * flangeCentroidOffset + ((tw * webHeight) / 2) * (webHeight / 4));
  const plasticModulusY = (tf * bf ** 2) / 2 + (webHeight * tw ** 2) / 4;

  return {
    area: quantity(area, "m²", "area"),
    centroidFromBottom: quantity(centroid, "m", "length"),
    ix: quantity(ix, "m⁴", "inertia"),
    iy: quantity(iy, "m⁴", "inertia"),
    elasticModulusX: quantity(elasticModulusX, "m³", "sectionModulus"),
    elasticModulusY: quantity(elasticModulusY, "m³", "sectionModulus"),
    plasticModulusX: quantity(plasticModulusX, "m³", "sectionModulus"),
    plasticModulusY: quantity(plasticModulusY, "m³", "sectionModulus"),
    massPerMetre: quantity(area * steelDensity, "kg/m", "linearMass"),
  };
}

export function compareProperty(
  property: keyof SectionProperties,
  calculatedValue: number,
  catalogueValue: number,
  relativeTolerance: number,
  absoluteTolerance = 0,
): SectionPropertyComparison {
  if (relativeTolerance < 0 || absoluteTolerance < 0)
    throw new RangeError("Tolerances cannot be negative.");
  const absoluteDifference = Math.abs(calculatedValue - catalogueValue);
  const relativeDifference =
    catalogueValue === 0
      ? absoluteDifference === 0
        ? 0
        : Number.POSITIVE_INFINITY
      : absoluteDifference / Math.abs(catalogueValue);
  return {
    property,
    calculatedValue,
    catalogueValue,
    relativeDifference,
    withinTolerance:
      absoluteDifference <= absoluteTolerance || relativeDifference <= relativeTolerance,
  };
}
