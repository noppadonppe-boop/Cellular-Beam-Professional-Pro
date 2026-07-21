export type ProjectSettings = Readonly<{
  projectId: string;
  organizationId: string;
  general: {
    name: string;
    number: string;
    client: string;
    owner: string;
    siteLocation: string;
    buildingType: string;
    designer: string;
    checker: string;
    approver: string;
    revision: string;
    calculationDateIso: string;
    notes: string;
  };
  standards: {
    country: "TH" | "US" | "EU";
    primaryCode: string;
    secondaryGuidance: string;
    designMethod: "LRFD" | "ASD" | "EUROCODE";
    standardEdition: string;
    loadStandard: string;
    steelStandard: string;
    weldingStandard: string;
    reportLanguage: "th" | "en" | "bilingual";
  };
  materials: {
    steelGrade: string;
    weldElectrode: string;
    boltGrade: string;
    concreteGrade: string;
    steelDensity: { value: number; unit: "kg/m³" };
    corrosionAllowance: { value: number; unit: "mm" };
    temperature: { value: number; unit: "°C" };
  };
  analysis: {
    analysisOrder: "firstOrder" | "secondOrder";
    elementFormulation: "eulerBernoulli" | "timoshenko";
    solverTolerance: number;
    convergenceTolerance: number;
    includeShearDeformation: boolean;
    includeSelfWeight: boolean;
  };
  design: {
    method: "LRFD" | "ASD" | "EUROCODE";
    unbracedLength: { value: number; unit: "m" };
    effectiveLengthFactor: number;
    deflectionLimitRatio: number;
    designLifeYears: number;
    exposureCondition: string;
  };
  units: {
    profile: "thaiEngineeringMetric" | "siEngineering";
    significantFigures: number;
    decimalSeparator: "." | ",";
    thousandsSeparator: "," | "." | " ";
  };
  report: {
    companyName: string;
    address: string;
    engineerName: string;
    licenseNumber: string;
    reportTitle: string;
    confidentiality: "public" | "internal" | "confidential";
  };
  updatedAtIso: string;
  updatedBy: string;
}>;

export type ProjectSettingsRepository = {
  get: (projectId: string) => Promise<ProjectSettings | null>;
  save: (settings: ProjectSettings) => Promise<void>;
};
