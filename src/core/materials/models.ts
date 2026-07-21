import type { MassQuantity, StressQuantity } from "@/core/quantities";

export type VerificationStatus = "verified" | "userProvided" | "pendingVerification";

export type DataProvenance = Readonly<{
  sourceName: string;
  sourceReference: string;
  revision: string;
  retrievedAtIso: string;
  verificationStatus: VerificationStatus;
}>;

export type Material = Readonly<{
  id: string;
  name: string;
  elasticModulus: StressQuantity;
  poissonRatio: number;
  density: Readonly<{ value: number; unit: "kg/m³" }>;
  provenance: DataProvenance;
}>;

export type SteelGrade = Material &
  Readonly<{
    kind: "steel";
    gradeDesignation: string;
    yieldStrength: StressQuantity;
    ultimateStrength: StressQuantity;
    densityMassReference?: MassQuantity;
  }>;

export type WeldMaterial = Readonly<{
  id: string;
  kind: "weld";
  classification: string;
  nominalTensileStrength: StressQuantity;
  process: "SMAW" | "GMAW" | "FCAW" | "SAW" | "other";
  provenance: DataProvenance;
}>;
