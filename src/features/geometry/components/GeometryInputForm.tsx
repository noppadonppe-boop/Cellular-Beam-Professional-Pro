import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CellularGeometryFormValues } from "@/core/schemas/cellular-geometry";

type Props = Readonly<{
  register: UseFormRegister<CellularGeometryFormValues>;
  errors: FieldErrors<CellularGeometryFormValues>;
}>;

const numericFields: readonly [keyof CellularGeometryFormValues, string, string][] = [
  ["beamLengthMm", "Beam length", "mm"],
  ["parentDepthMm", "Parent depth", "mm"],
  ["finishedDepthMm", "Finished depth", "mm"],
  ["flangeWidthMm", "Flange width", "mm"],
  ["flangeThicknessMm", "Flange thickness", "mm"],
  ["webThicknessMm", "Web thickness", "mm"],
  ["openingDiameterMm", "Opening diameter", "mm"],
  ["pitchMm", "Opening pitch", "mm"],
  ["firstOpeningCenterMm", "First opening centre", "mm"],
  ["openingCount", "Number of openings", "count"],
  ["openingEccentricityMm", "Opening eccentricity", "mm"],
  ["minimumSolidEndZoneMm", "Minimum solid end zone", "mm"],
  ["weldSizeMm", "Weld size", "mm"],
  ["steelDensityKgM3", "Steel density", "kg/m³"],
];

export function GeometryInputForm({ register, errors }: Props) {
  return (
    <section className="geometry-input-card">
      <header>
        <div>
          <span className="eyebrow">GEOMETRY INPUT</span>
          <h2>Straight cellular beam</h2>
        </div>
        <span className="unit-chip">INPUT: mm · CORE: m</span>
      </header>
      <div className="geometry-form-grid">
        {numericFields.map(([name, label, unit]) => (
          <label className="field" key={name}>
            <span>
              {label} <b>{unit}</b>
            </span>
            <input
              type="number"
              step={name === "openingCount" ? 1 : "any"}
              {...register(name, { valueAsNumber: true })}
            />
            {errors[name] && <small>{errors[name].message}</small>}
          </label>
        ))}
        <label className="field">
          <span>Cutting pattern</span>
          <select {...register("cuttingPattern")}>
            <option value="circular-interlock">Circular interlock</option>
          </select>
        </label>
        <label className="field">
          <span>Weld type</span>
          <select {...register("weldType")}>
            <option value="continuous-fillet">Continuous fillet</option>
            <option value="continuous-groove">Continuous groove</option>
          </select>
        </label>
      </div>
      <p className="geometry-scope-note">
        Phase 4 generates geometry only. Capacity, weld resistance and structural analysis remain
        NOT IMPLEMENTED.
      </p>
    </section>
  );
}
