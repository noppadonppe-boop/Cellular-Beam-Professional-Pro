import type { CellularGeometryResult } from "@/core/cellular";
import type { OpeningAction } from "@/core/cellular/checks";
import type { PointLoad } from "@/core/loads";

export type WeldAction = Readonly<{ location: string; xM: number; longitudinalForceN: number; shearDemandN: number; status: "actionExtracted" }>;
export type ConcentratedLoadReview = Readonly<{ loadId: string; label: string; xM: number; forceN: number; nearestOpeningNumber: number; nearestOpeningEdgeDistanceM: number; requiresStiffenerReview: boolean; status: "reviewRequired" }>;
export type ConnectionActionExtraction = Readonly<{ welds: readonly WeldAction[]; concentratedLoads: readonly ConcentratedLoadReview[]; limitations: readonly string[]; extractionVersion: "connection-action-extraction-1.0.0" }>;
export class ConnectionActionError extends Error { public constructor(message: string) { super(message); this.name = "ConnectionActionError"; } }

/** Creates demand schedules; no weld/stiffener resistance is evaluated without a governing standard. */
export function extractConnectionActions(geometry: CellularGeometryResult, openingActions: readonly OpeningAction[], pointLoads: readonly PointLoad[]): ConnectionActionExtraction {
  if (!geometry.isValid) throw new ConnectionActionError("Valid cellular geometry is required.");
  if (openingActions.length !== geometry.openings.length) throw new ConnectionActionError("Opening action schedule does not match geometry.");
  const welds = openingActions.map((action) => ({ location: `Opening O${String(action.openingNumber)} tee splice`, xM: action.xM, longitudinalForceN: action.topTeeAxialN, shearDemandN: action.teeShearN, status: "actionExtracted" as const }));
  const concentratedLoads = pointLoads.map((load) => reviewPointLoad(load, geometry));
  return { welds, concentratedLoads, limitations: ["Longitudinal weld actions are derived from the symmetric-tee action extraction at each opening.", "Weld throat, electrode, weld group eccentricity, fabrication category, and resistance are not evaluated.", "Stiffener review flags are proximity triggers only; web yielding, crippling, buckling, bearing, and stiffener resistance are not evaluated."], extractionVersion: "connection-action-extraction-1.0.0" };
}
function reviewPointLoad(load: PointLoad, geometry: CellularGeometryResult): ConcentratedLoadReview {
  const first = geometry.openings[0];
  if (!first) throw new ConnectionActionError("At least one opening is required for concentrated-load review.");
  let nearest = first;
  for (const opening of geometry.openings.slice(1)) {
    if (Math.abs(load.positionXM - nearestEdge(load.positionXM, opening.leftEdgeM, opening.rightEdgeM)) < Math.abs(load.positionXM - nearestEdge(load.positionXM, nearest.leftEdgeM, nearest.rightEdgeM))) nearest = opening;
  }
  const distance = Math.abs(load.positionXM - nearestEdge(load.positionXM, nearest.leftEdgeM, nearest.rightEdgeM));
  return { loadId: load.id, label: load.label, xM: load.positionXM, forceN: Math.abs(load.fyN), nearestOpeningNumber: nearest.number, nearestOpeningEdgeDistanceM: distance, requiresStiffenerReview: distance < nearest.diameterM, status: "reviewRequired" };
}
function nearestEdge(x: number, left: number, right: number): number { return Math.abs(x - left) <= Math.abs(x - right) ? left : right; }
