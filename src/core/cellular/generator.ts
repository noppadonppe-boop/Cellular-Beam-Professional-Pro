import {
  CellularGeometryError,
  type CellularGeometryInput,
  type CellularGeometryResult,
  type GeometryIssue,
  type TeeGeometry,
} from "@/core/cellular/models";

const MM_TO_M = 0.001;

function teeGeometry(
  depthM: number,
  flangeWidthM: number,
  flangeThicknessM: number,
  webThicknessM: number,
): TeeGeometry {
  if (depthM <= flangeThicknessM) {
    return { depthM, areaM2: 0, centroidFromOuterFaceM: 0, inertiaAboutOwnCentroidM4: 0 };
  }
  const webHeight = depthM - flangeThicknessM;
  const flangeArea = flangeWidthM * flangeThicknessM;
  const webArea = webThicknessM * webHeight;
  const area = flangeArea + webArea;
  const flangeY = flangeThicknessM / 2;
  const webY = flangeThicknessM + webHeight / 2;
  const centroid = (flangeArea * flangeY + webArea * webY) / area;
  const inertia =
    (flangeWidthM * flangeThicknessM ** 3) / 12 +
    flangeArea * (centroid - flangeY) ** 2 +
    (webThicknessM * webHeight ** 3) / 12 +
    webArea * (webY - centroid) ** 2;
  return {
    depthM,
    areaM2: area,
    centroidFromOuterFaceM: centroid,
    inertiaAboutOwnCentroidM4: inertia,
  };
}

function assertFiniteInput(input: CellularGeometryInput): void {
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new CellularGeometryError(`${key} must be finite.`);
    }
  }
  if (!Number.isInteger(input.openingCount)) {
    throw new CellularGeometryError("openingCount must be an integer.");
  }
}

export function generateCellularGeometry(input: CellularGeometryInput): CellularGeometryResult {
  assertFiniteInput(input);
  const issues: GeometryIssue[] = [];
  const positiveFields = [
    ["beamLengthMm", input.beamLengthMm],
    ["parentDepthMm", input.parentDepthMm],
    ["flangeWidthMm", input.flangeWidthMm],
    ["flangeThicknessMm", input.flangeThicknessMm],
    ["webThicknessMm", input.webThicknessMm],
    ["finishedDepthMm", input.finishedDepthMm],
    ["openingDiameterMm", input.openingDiameterMm],
    ["pitchMm", input.pitchMm],
    ["steelDensityKgM3", input.steelDensityKgM3],
    ["weldSizeMm", input.weldSizeMm],
  ] as const;
  for (const [field, value] of positiveFields) {
    if (value <= 0)
      issues.push({
        code: "NON_POSITIVE",
        severity: "error",
        message: `${field} must be greater than zero.`,
      });
  }
  if (input.openingCount < 1) {
    issues.push({
      code: "OPENING_COUNT",
      severity: "error",
      message: "At least one opening is required.",
    });
  }

  const beamLengthM = input.beamLengthMm * MM_TO_M;
  const parentDepthM = input.parentDepthMm * MM_TO_M;
  const finishedDepthM = input.finishedDepthMm * MM_TO_M;
  const flangeWidthM = input.flangeWidthMm * MM_TO_M;
  const flangeThicknessM = input.flangeThicknessMm * MM_TO_M;
  const webThicknessM = input.webThicknessMm * MM_TO_M;
  const diameterM = input.openingDiameterMm * MM_TO_M;
  const pitchM = input.pitchMm * MM_TO_M;
  const eccentricityM = input.openingEccentricityMm * MM_TO_M;
  const minimumSolidEndZoneM = input.minimumSolidEndZoneMm * MM_TO_M;
  const firstCenterM = input.firstOpeningCenterMm * MM_TO_M;
  const openingCount = Math.max(0, input.openingCount);

  if (flangeThicknessM * 2 >= parentDepthM || webThicknessM > flangeWidthM) {
    issues.push({
      code: "PARENT_SECTION",
      severity: "error",
      message: "Parent I-section dimensions are not geometrically valid.",
    });
  }
  if (finishedDepthM < parentDepthM) {
    issues.push({
      code: "FINISHED_DEPTH",
      severity: "error",
      message:
        "Finished depth cannot be less than the parent-section depth for the supported cutting pattern.",
    });
  }
  if (pitchM <= diameterM) {
    issues.push({
      code: "OVERLAPPING_OPENINGS",
      severity: "error",
      message: "Pitch must exceed opening diameter to leave a positive web post.",
    });
  }

  const topTeeDepthM = finishedDepthM / 2 - eccentricityM - diameterM / 2;
  const bottomTeeDepthM = finishedDepthM / 2 + eccentricityM - diameterM / 2;
  if (topTeeDepthM <= flangeThicknessM || bottomTeeDepthM <= flangeThicknessM) {
    issues.push({
      code: "TEE_DEPTH",
      severity: "error",
      message: "Opening intersects a flange or leaves no tee web stem.",
    });
  }
  const topTee = teeGeometry(topTeeDepthM, flangeWidthM, flangeThicknessM, webThicknessM);
  const bottomTee = teeGeometry(bottomTeeDepthM, flangeWidthM, flangeThicknessM, webThicknessM);

  const openings = Array.from({ length: openingCount }, (_, index) => {
    const centerXM = firstCenterM + index * pitchM;
    return {
      number: index + 1,
      centerXM,
      diameterM,
      leftEdgeM: centerXM - diameterM / 2,
      rightEdgeM: centerXM + diameterM / 2,
    };
  });
  for (const opening of openings) {
    if (
      opening.leftEdgeM < minimumSolidEndZoneM ||
      opening.rightEdgeM > beamLengthM - minimumSolidEndZoneM
    ) {
      issues.push({
        code: "END_ZONE",
        severity: "error",
        openingNumber: opening.number,
        message: `Opening O${String(opening.number)} intrudes into the minimum solid end zone.`,
      });
    }
  }
  const webPosts = openings.slice(0, -1).map((opening, index) => ({
    number: index + 1,
    centerXM: (opening.centerXM + (openings[index + 1]?.centerXM ?? opening.centerXM)) / 2,
    clearWidthM: pitchM - diameterM,
  }));
  if (eccentricityM !== 0) {
    issues.push({
      code: "ASYMMETRIC_TEE",
      severity: "warning",
      message:
        "Opening eccentricity creates unequal tees; structural checks are not implemented in Phase 4.",
    });
  }

  const parentWebHeightM = Math.max(0, parentDepthM - 2 * flangeThicknessM);
  const parentAreaM2 = 2 * flangeWidthM * flangeThicknessM + webThicknessM * parentWebHeightM;
  const grossWebHeightM = Math.max(0, finishedDepthM - 2 * flangeThicknessM);
  const grossAreaAtWebPostM2 =
    2 * flangeWidthM * flangeThicknessM + webThicknessM * grossWebHeightM;
  const flangeArea = flangeWidthM * flangeThicknessM;
  const grossIxAtWebPostM4 =
    2 *
      ((flangeWidthM * flangeThicknessM ** 3) / 12 +
        flangeArea * (finishedDepthM / 2 - flangeThicknessM / 2) ** 2) +
    (webThicknessM * grossWebHeightM ** 3) / 12;
  const removedAreaAlongBeamM2 =
    openingCount > 0 && beamLengthM > 0
      ? (openingCount * Math.PI * (diameterM / 2) ** 2 * webThicknessM) / beamLengthM
      : 0;

  const lastOpening = openings.at(-1);
  return {
    input,
    beamLengthM,
    finishedDepthM,
    topTee,
    bottomTee,
    openings,
    webPosts,
    openingRatio: finishedDepthM > 0 ? diameterM / finishedDepthM : 0,
    firstSolidEndZoneM: openings[0]?.leftEdgeM ?? beamLengthM,
    lastSolidEndZoneM: lastOpening ? beamLengthM - lastOpening.rightEdgeM : beamLengthM,
    netAreaAtOpeningM2: topTee.areaM2 + bottomTee.areaM2,
    grossAreaAtWebPostM2,
    grossIxAtWebPostM4,
    parentMassPerMetreKgM: parentAreaM2 * input.steelDensityKgM3,
    approximateFinishedMassPerMetreKgM:
      Math.max(0, grossAreaAtWebPostM2 - removedAreaAlongBeamM2) * input.steelDensityKgM3,
    approximateWeldLengthM: 2 * beamLengthM,
    issues,
    isValid: !issues.some((issue) => issue.severity === "error"),
    generatorVersion: "cellular-geometry-1.0.0",
  };
}
