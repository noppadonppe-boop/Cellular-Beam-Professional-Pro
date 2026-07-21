export type GeometrySeverity = "error" | "warning" | "information";

export type GeometryIssue = Readonly<{
  code: string;
  severity: GeometrySeverity;
  message: string;
  openingNumber?: number;
}>;

export type CellularGeometryInput = Readonly<{
  beamLengthMm: number;
  parentDepthMm: number;
  flangeWidthMm: number;
  flangeThicknessMm: number;
  webThicknessMm: number;
  finishedDepthMm: number;
  openingDiameterMm: number;
  pitchMm: number;
  firstOpeningCenterMm: number;
  openingCount: number;
  openingEccentricityMm: number;
  minimumSolidEndZoneMm: number;
  steelDensityKgM3: number;
  weldSizeMm: number;
  cuttingPattern: "circular-interlock";
  weldType: "continuous-fillet" | "continuous-groove";
}>;

export type TeeGeometry = Readonly<{
  depthM: number;
  areaM2: number;
  centroidFromOuterFaceM: number;
  inertiaAboutOwnCentroidM4: number;
}>;

export type CellularOpening = Readonly<{
  number: number;
  centerXM: number;
  diameterM: number;
  leftEdgeM: number;
  rightEdgeM: number;
}>;

export type WebPost = Readonly<{
  number: number;
  centerXM: number;
  clearWidthM: number;
}>;

export type CellularGeometryResult = Readonly<{
  input: CellularGeometryInput;
  beamLengthM: number;
  finishedDepthM: number;
  topTee: TeeGeometry;
  bottomTee: TeeGeometry;
  openings: readonly CellularOpening[];
  webPosts: readonly WebPost[];
  openingRatio: number;
  firstSolidEndZoneM: number;
  lastSolidEndZoneM: number;
  netAreaAtOpeningM2: number;
  grossAreaAtWebPostM2: number;
  grossIxAtWebPostM4: number;
  parentMassPerMetreKgM: number;
  approximateFinishedMassPerMetreKgM: number;
  approximateWeldLengthM: number;
  issues: readonly GeometryIssue[];
  isValid: boolean;
  generatorVersion: "cellular-geometry-1.0.0";
}>;

export class CellularGeometryError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "CellularGeometryError";
  }
}
