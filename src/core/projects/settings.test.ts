import { describe, expect, it } from "vitest";
import { projectSettingsSchema } from "@/core/schemas/project-settings";

const valid = {
  projectId: "p1",
  organizationId: "o1",
  general: {
    name: "Warehouse",
    number: "P-01",
    client: "",
    owner: "",
    siteLocation: "",
    buildingType: "",
    designer: "",
    checker: "",
    approver: "",
    revision: "0",
    calculationDateIso: "2026-07-21",
    notes: "",
  },
  standards: {
    country: "TH",
    primaryCode: "TIS",
    secondaryGuidance: "",
    designMethod: "LRFD",
    standardEdition: "2026",
    loadStandard: "Thai",
    steelStandard: "Thai",
    weldingStandard: "AWS D1.1",
    reportLanguage: "bilingual",
  },
  materials: {
    steelGrade: "SM490",
    weldElectrode: "E70XX",
    boltGrade: "",
    concreteGrade: "",
    steelDensity: { value: 7850, unit: "kg/m³" },
    corrosionAllowance: { value: 0, unit: "mm" },
    temperature: { value: 30, unit: "°C" },
  },
  analysis: {
    analysisOrder: "firstOrder",
    elementFormulation: "eulerBernoulli",
    solverTolerance: 1e-9,
    convergenceTolerance: 1e-6,
    includeShearDeformation: false,
    includeSelfWeight: true,
  },
  design: {
    method: "LRFD",
    unbracedLength: { value: 3, unit: "m" },
    effectiveLengthFactor: 1,
    deflectionLimitRatio: 360,
    designLifeYears: 50,
    exposureCondition: "internal",
  },
  units: {
    profile: "thaiEngineeringMetric",
    significantFigures: 4,
    decimalSeparator: ".",
    thousandsSeparator: ",",
  },
  report: {
    companyName: "",
    address: "",
    engineerName: "",
    licenseNumber: "",
    reportTitle: "Calculation Report",
    confidentiality: "confidential",
  },
  updatedAtIso: "2026-07-21T00:00:00.000Z",
  updatedBy: "u1",
} as const;

describe("project settings validation", () => {
  it("accepts a complete settings snapshot with unit metadata", () =>
    expect(projectSettingsSchema.safeParse(valid).success).toBe(true));
  it("rejects missing standard edition", () =>
    expect(
      projectSettingsSchema.safeParse({
        ...valid,
        standards: { ...valid.standards, standardEdition: "" },
      }).success,
    ).toBe(false));
  it("rejects invalid numerical tolerance", () =>
    expect(
      projectSettingsSchema.safeParse({
        ...valid,
        analysis: { ...valid.analysis, solverTolerance: 0 },
      }).success,
    ).toBe(false));
});
