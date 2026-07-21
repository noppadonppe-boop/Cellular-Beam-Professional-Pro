import { z } from "zod";

const positive = z.number().positive();

export const cellularGeometryInputSchema = z
  .object({
    beamLengthMm: positive,
    parentDepthMm: positive,
    flangeWidthMm: positive,
    flangeThicknessMm: positive,
    webThicknessMm: positive,
    finishedDepthMm: positive,
    openingDiameterMm: positive,
    pitchMm: positive,
    firstOpeningCenterMm: z.number().nonnegative(),
    openingCount: z.number().int().min(1).max(200),
    openingEccentricityMm: z.number(),
    minimumSolidEndZoneMm: z.number().nonnegative(),
    steelDensityKgM3: positive,
    weldSizeMm: positive,
    cuttingPattern: z.literal("circular-interlock"),
    weldType: z.enum(["continuous-fillet", "continuous-groove"]),
  })
  .superRefine((data, context) => {
    if (data.pitchMm <= data.openingDiameterMm) {
      context.addIssue({
        code: "custom",
        path: ["pitchMm"],
        message: "Pitch must exceed opening diameter.",
      });
    }
    if (data.finishedDepthMm < data.parentDepthMm) {
      context.addIssue({
        code: "custom",
        path: ["finishedDepthMm"],
        message: "Finished depth must not be less than parent depth.",
      });
    }
  });

export type CellularGeometryFormValues = z.infer<typeof cellularGeometryInputSchema>;
