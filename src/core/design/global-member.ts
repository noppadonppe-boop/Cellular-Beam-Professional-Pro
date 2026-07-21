import type {
  GlobalMemberCheck,
  GlobalMemberCheckInput,
  GlobalMemberCheckResult,
} from "@/core/design/models";
import { GlobalMemberCheckError } from "@/core/design/models";

/**
 * Calculates transparent gross-section yield and serviceability screening only.
 * It deliberately does not substitute for a code-specific member stability design.
 */
export function checkGlobalSteelMember(input: GlobalMemberCheckInput): GlobalMemberCheckResult {
  validateInput(input);
  const fy = input.steelGrade.yieldStrength.canonicalValue;
  const area = input.sectionProperties.area.canonicalValue;
  const z = input.sectionProperties.plasticModulusX.canonicalValue;
  const phi = input.basis.resistanceFactor;
  const momentCapacity = phi * fy * z;
  const shearArea =
    input.sectionGeometry.webThickness.canonicalValue *
    (input.sectionGeometry.depth.canonicalValue -
      2 * input.sectionGeometry.flangeThickness.canonicalValue);
  const shearCapacity = phi * 0.6 * fy * shearArea;
  const axialCapacity = phi * fy * area;
  const axialDemand = Math.abs(input.maximumAxialCompressionN ?? 0);
  const momentDemand = Math.abs(input.maximumMomentNm);
  const shearDemand = Math.abs(input.maximumShearN);
  const deflectionDemand = Math.abs(input.maximumDeflectionM);
  const deflectionCapacity = input.spanM / input.deflectionLimitRatio;
  const axialFlexureUtilization = axialDemand / axialCapacity + momentDemand / momentCapacity;
  const checks: GlobalMemberCheck[] = [
    evaluated(
      "flexure-yield",
      "Gross-section flexural yield",
      momentDemand,
      momentCapacity,
      "N·m",
      "φ Fy Zx; gross section only",
    ),
    evaluated(
      "shear-yield",
      "Gross-section shear yield",
      shearDemand,
      shearCapacity,
      "N",
      "φ 0.6 Fy Aw; Aw = tw (d − 2tf)",
    ),
    evaluated(
      "axial-yield",
      "Gross-section axial yield",
      axialDemand,
      axialCapacity,
      "N",
      "φ Fy Ag; compression stability excluded",
    ),
    evaluated(
      "axial-flexure-screen",
      "Axial + flexure yield screen",
      axialFlexureUtilization,
      1,
      "ratio",
      "Pu/(φ Fy Ag) + Mu/(φ Fy Zx); screening interaction only",
    ),
    evaluated(
      "deflection",
      "Vertical deflection",
      deflectionDemand,
      deflectionCapacity,
      "m",
      `Service limit L/${input.deflectionLimitRatio.toString()} supplied with this run`,
    ),
    notEvaluated(
      "ltb",
      "Lateral-torsional buckling",
      "Requires a selected design standard, moment-gradient treatment, restraint locations, load-height effects, and section classification.",
    ),
    notEvaluated(
      "local-buckling",
      "Local flange and web buckling",
      "Requires code-specific width-to-thickness limits and cellular-section applicability review.",
    ),
  ];
  const evaluatedChecks = checks.filter((check) => check.status !== "notEvaluated");
  const governing = evaluatedChecks.reduce<GlobalMemberCheck | null>((current, check) => {
    if (check.utilization === null) return current;
    return !current || (current.utilization ?? -Infinity) < check.utilization ? check : current;
  }, null);
  return {
    checks,
    governing,
    analysisVersion: "global-member-screening-1.0.0",
    basis: input.basis,
  };
}

function evaluated(
  id: Extract<
    GlobalMemberCheck["id"],
    "flexure-yield" | "shear-yield" | "axial-yield" | "axial-flexure-screen" | "deflection"
  >,
  title: string,
  demand: number,
  capacity: number,
  unit: string,
  method: string,
): GlobalMemberCheck {
  const utilization = demand / capacity;
  return {
    id,
    title,
    demand,
    capacity,
    unit,
    utilization,
    status: utilization <= 1 ? "pass" : "fail",
    method,
  };
}

function notEvaluated(
  id: Extract<GlobalMemberCheck["id"], "ltb" | "local-buckling">,
  title: string,
  limitation: string,
): GlobalMemberCheck {
  return {
    id,
    title,
    demand: null,
    capacity: null,
    unit: "—",
    utilization: null,
    status: "notEvaluated",
    method: "No standard-based equation selected",
    limitation,
  };
}

function validateInput(input: GlobalMemberCheckInput): void {
  const values = [
    input.spanM,
    input.unbracedLengthM,
    input.maximumMomentNm,
    input.maximumShearN,
    input.maximumDeflectionM,
    input.deflectionLimitRatio,
    input.basis.resistanceFactor,
    input.sectionProperties.area.canonicalValue,
    input.sectionProperties.ix.canonicalValue,
    input.sectionProperties.plasticModulusX.canonicalValue,
    input.sectionGeometry.depth.canonicalValue,
    input.sectionGeometry.webThickness.canonicalValue,
    input.sectionGeometry.flangeThickness.canonicalValue,
    input.steelGrade.yieldStrength.canonicalValue,
  ];
  if (!values.every(Number.isFinite))
    throw new GlobalMemberCheckError("Global member input contains a non-finite value.");
  if (
    input.spanM <= 0 ||
    input.unbracedLengthM <= 0 ||
    input.deflectionLimitRatio <= 0 ||
    input.basis.resistanceFactor <= 0 ||
    input.basis.resistanceFactor > 1
  ) {
    throw new GlobalMemberCheckError(
      "Span, restraint length, deflection ratio, and resistance factor must be positive; resistance factor cannot exceed 1.",
    );
  }
  if (
    input.sectionGeometry.depth.canonicalValue <=
    2 * input.sectionGeometry.flangeThickness.canonicalValue
  )
    throw new GlobalMemberCheckError("I-section clear web depth must be positive.");
}
