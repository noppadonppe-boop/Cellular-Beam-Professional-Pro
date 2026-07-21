import { getUnitDefinition } from "@/core/quantities/registry";
import {
  IncompatibleDimensionError,
  type Dimension,
  type Quantity,
  type UnitSymbol,
} from "@/core/quantities/types";

export function quantity<D extends Dimension>(
  value: number,
  unit: UnitSymbol,
  expectedDimension: D,
): Quantity<D> {
  if (!Number.isFinite(value)) throw new RangeError("Quantity value must be finite.");
  const definition = getUnitDefinition(unit);
  if (definition.dimension !== expectedDimension)
    throw new IncompatibleDimensionError(expectedDimension, definition.dimension);
  return {
    dimension: expectedDimension,
    rawValue: value,
    displayUnit: unit,
    canonicalValue: value * definition.toCanonicalFactor,
    canonicalUnit: definition.canonicalUnit,
  } as Quantity<D>;
}

export function convert<D extends Dimension>(source: Quantity<D>, targetUnit: UnitSymbol): number {
  const target = getUnitDefinition(targetUnit);
  if (target.dimension !== source.dimension)
    throw new IncompatibleDimensionError(source.dimension, target.dimension);
  return source.canonicalValue / target.toCanonicalFactor;
}

export function assertSameDimension(left: Quantity<Dimension>, right: Quantity<Dimension>): void {
  if (left.dimension !== right.dimension)
    throw new IncompatibleDimensionError(left.dimension, right.dimension);
}
