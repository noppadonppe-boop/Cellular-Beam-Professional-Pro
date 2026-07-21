import { z } from "zod";

const positiveFinite = z.number().positive();
export const quantityInputSchema = z.object({
  rawValue: z.number(),
  displayUnit: z.string().min(1),
  canonicalValue: z.number(),
  canonicalUnit: z.string().min(1),
});
export const dataProvenanceSchema = z.object({
  sourceName: z.string().min(1),
  sourceReference: z.string().min(1),
  revision: z.string().min(1),
  retrievedAtIso: z.iso.datetime(),
  verificationStatus: z.enum(["verified", "userProvided", "pendingVerification"]),
});
export const customISectionInputSchema = z
  .object({
    designation: z.string().trim().min(2).max(80),
    depthMm: positiveFinite,
    flangeWidthMm: positiveFinite,
    webThicknessMm: positiveFinite,
    flangeThicknessMm: positiveFinite,
    steelDensityKgM3: positiveFinite.default(7850),
    sourceName: z.string().trim().min(2).max(120),
    sourceReference: z.string().trim().min(2).max(200),
    revision: z.string().trim().min(1).max(40),
    verificationStatus: z.enum(["userProvided", "pendingVerification"]).default("userProvided"),
  })
  .superRefine((value, context) => {
    if (2 * value.flangeThicknessMm >= value.depthMm)
      context.addIssue({
        code: "custom",
        path: ["flangeThicknessMm"],
        message: "Twice flange thickness must be less than depth.",
      });
    if (value.webThicknessMm > value.flangeWidthMm)
      context.addIssue({
        code: "custom",
        path: ["webThicknessMm"],
        message: "Web thickness cannot exceed flange width.",
      });
  });
export type CustomISectionFormInput = z.input<typeof customISectionInputSchema>;
export type CustomISectionInput = z.output<typeof customISectionInputSchema>;

export const steelGradeInputSchema = z
  .object({
    gradeDesignation: z.string().trim().min(1),
    yieldStrengthMpa: positiveFinite,
    ultimateStrengthMpa: positiveFinite,
    elasticModulusMpa: positiveFinite.default(200_000),
    poissonRatio: z.number().min(0).max(0.5).default(0.3),
    densityKgM3: positiveFinite.default(7850),
    provenance: dataProvenanceSchema,
  })
  .refine((value) => value.ultimateStrengthMpa >= value.yieldStrengthMpa, {
    path: ["ultimateStrengthMpa"],
    message: "Ultimate strength must not be less than yield strength.",
  });

export const weldMaterialInputSchema = z.object({
  classification: z.string().trim().min(1),
  nominalTensileStrengthMpa: positiveFinite,
  process: z.enum(["SMAW", "GMAW", "FCAW", "SAW", "other"]),
  provenance: dataProvenanceSchema,
});

const storedQuantitySchema = quantityInputSchema.extend({ dimension: z.string().min(1) });
export const sectionRecordDocumentSchema = z.object({
  id: z.string().min(1),
  designation: z.string().min(1),
  sectionType: z.literal("i-section"),
  geometry: z.object({
    depth: storedQuantitySchema,
    flangeWidth: storedQuantitySchema,
    webThickness: storedQuantitySchema,
    flangeThickness: storedQuantitySchema,
    rootRadius: storedQuantitySchema.optional(),
  }),
  properties: z.object({
    area: storedQuantitySchema,
    centroidFromBottom: storedQuantitySchema,
    ix: storedQuantitySchema,
    iy: storedQuantitySchema,
    elasticModulusX: storedQuantitySchema,
    elasticModulusY: storedQuantitySchema,
    plasticModulusX: storedQuantitySchema,
    plasticModulusY: storedQuantitySchema,
    massPerMetre: storedQuantitySchema,
  }),
  steelDensity: z.object({ value: positiveFinite, unit: z.literal("kg/m³") }),
  provenance: dataProvenanceSchema,
  createdAtIso: z.iso.datetime(),
  updatedAtIso: z.iso.datetime(),
});
