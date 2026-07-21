import { convert } from "@/core/quantities/quantity";
import type { Dimension, Quantity, UnitSymbol } from "@/core/quantities/types";

export function roundToSignificantFigures(value: number, significantFigures: number): number {
  if (!Number.isInteger(significantFigures) || significantFigures < 1)
    throw new RangeError("Significant figures must be a positive integer.");
  if (value === 0) return 0;
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const scale = 10 ** (significantFigures - exponent - 1);
  return Math.round(value * scale) / scale;
}

export type EngineeringFormatOptions = Readonly<{
  significantFigures?: number;
  locale?: "th-TH" | "en-US";
  notation?: "standard" | "engineering";
}>;

export function formatEngineering<D extends Dimension>(
  source: Quantity<D>,
  targetUnit: UnitSymbol,
  options: EngineeringFormatOptions = {},
): string {
  const value = convert(source, targetUnit);
  const figures = options.significantFigures ?? 4;
  const rounded = roundToSignificantFigures(value, figures);
  if (options.notation === "engineering" && rounded !== 0) {
    const exponent = Math.floor(Math.log10(Math.abs(rounded)) / 3) * 3;
    return `${(rounded / 10 ** exponent).toLocaleString(options.locale ?? "en-US", { maximumSignificantDigits: figures })}×10^${exponent.toString()} ${targetUnit}`;
  }
  return `${rounded.toLocaleString(options.locale ?? "en-US", { maximumSignificantDigits: figures })} ${targetUnit}`;
}
