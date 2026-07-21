import type { SteelGrade } from "@/core/materials";
import type { ISectionGeometry, SectionProperties } from "@/core/sections";

export type CheckStatus = "pass" | "fail" | "notEvaluated";

export type GlobalMemberCheckInput = Readonly<{
  sectionProperties: SectionProperties;
  sectionGeometry: ISectionGeometry;
  steelGrade: SteelGrade;
  spanM: number;
  unbracedLengthM: number;
  maximumMomentNm: number;
  maximumShearN: number;
  maximumAxialCompressionN?: number;
  maximumDeflectionM: number;
  deflectionLimitRatio: number;
  basis: Readonly<{
    reference: string;
    revision: string;
    resistanceFactor: number;
  }>;
}>;

export type GlobalMemberCheck = Readonly<{
  id:
    | "flexure-yield"
    | "shear-yield"
    | "axial-yield"
    | "axial-flexure-screen"
    | "deflection"
    | "ltb"
    | "local-buckling";
  title: string;
  demand: number | null;
  capacity: number | null;
  unit: string;
  utilization: number | null;
  status: CheckStatus;
  method: string;
  limitation?: string;
}>;

export type GlobalMemberCheckResult = Readonly<{
  checks: readonly GlobalMemberCheck[];
  governing: GlobalMemberCheck | null;
  analysisVersion: "global-member-screening-1.0.0";
  basis: GlobalMemberCheckInput["basis"];
}>;

export class GlobalMemberCheckError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "GlobalMemberCheckError";
  }
}
