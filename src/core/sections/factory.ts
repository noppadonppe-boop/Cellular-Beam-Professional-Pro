import { quantity } from "@/core/quantities";
import type { CustomISectionInput } from "@/core/schemas/engineering";
import { calculateISectionProperties } from "@/core/sections/calculator";
import type { ISectionGeometry, SectionRecord } from "@/core/sections/models";

export function createCustomSectionRecord(
  input: CustomISectionInput,
  id: string,
  timestampIso: string,
): SectionRecord {
  const geometry: ISectionGeometry = {
    depth: quantity(input.depthMm, "mm", "length"),
    flangeWidth: quantity(input.flangeWidthMm, "mm", "length"),
    webThickness: quantity(input.webThicknessMm, "mm", "length"),
    flangeThickness: quantity(input.flangeThicknessMm, "mm", "length"),
  };
  return {
    id,
    designation: input.designation,
    sectionType: "i-section",
    geometry,
    properties: calculateISectionProperties(geometry, input.steelDensityKgM3),
    steelDensity: { value: input.steelDensityKgM3, unit: "kg/m³" },
    provenance: {
      sourceName: input.sourceName,
      sourceReference: input.sourceReference,
      revision: input.revision,
      retrievedAtIso: timestampIso,
      verificationStatus: input.verificationStatus,
    },
    createdAtIso: timestampIso,
    updatedAtIso: timestampIso,
  };
}
