import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Save } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { convert } from "@/core/quantities";
import {
  customISectionInputSchema,
  type CustomISectionFormInput,
  type CustomISectionInput,
} from "@/core/schemas/engineering";
import { calculateISectionProperties } from "@/core/sections";
import { quantity } from "@/core/quantities";
import { Button } from "@/components/ui/button";

type Props = { onSave: (input: CustomISectionInput) => Promise<void> };

export function CustomSectionForm({ onSave }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CustomISectionFormInput, unknown, CustomISectionInput>({
    resolver: zodResolver(customISectionInputSchema),
    defaultValues: {
      designation: "",
      depthMm: 300,
      flangeWidthMm: 150,
      webThicknessMm: 6.5,
      flangeThicknessMm: 9,
      steelDensityKgM3: 7850,
      sourceName: "",
      sourceReference: "",
      revision: "1",
      verificationStatus: "userProvided",
    },
  });
  const watched = useWatch({ control });
  const preview = useMemo(() => {
    const result = customISectionInputSchema.safeParse(watched);
    if (!result.success) return null;
    return calculateISectionProperties(
      {
        depth: quantity(result.data.depthMm, "mm", "length"),
        flangeWidth: quantity(result.data.flangeWidthMm, "mm", "length"),
        webThickness: quantity(result.data.webThicknessMm, "mm", "length"),
        flangeThickness: quantity(result.data.flangeThicknessMm, "mm", "length"),
      },
      result.data.steelDensityKgM3,
    );
  }, [watched]);

  const numeric = { valueAsNumber: true } as const;
  return (
    <form
      className="section-form"
      onSubmit={(event) => {
        void handleSubmit(onSave)(event);
      }}
    >
      <div className="section-form-heading">
        <div>
          <span className="eyebrow">CUSTOM I-SECTION</span>
          <h2>Section geometry</h2>
        </div>
        <span className="unit-chip">Input: mm · Canonical: m</span>
      </div>
      <div className="form-grid">
        <Field label="Designation" error={errors.designation?.message}>
          <input {...register("designation")} placeholder="e.g. USER-I-300" />
        </Field>
        <Field label="Overall depth, d (mm)" error={errors.depthMm?.message}>
          <input type="number" step="any" {...register("depthMm", numeric)} />
        </Field>
        <Field label="Flange width, bf (mm)" error={errors.flangeWidthMm?.message}>
          <input type="number" step="any" {...register("flangeWidthMm", numeric)} />
        </Field>
        <Field label="Web thickness, tw (mm)" error={errors.webThicknessMm?.message}>
          <input type="number" step="any" {...register("webThicknessMm", numeric)} />
        </Field>
        <Field label="Flange thickness, tf (mm)" error={errors.flangeThicknessMm?.message}>
          <input type="number" step="any" {...register("flangeThicknessMm", numeric)} />
        </Field>
        <Field label="Steel density (kg/m³)" error={errors.steelDensityKgM3?.message}>
          <input type="number" step="any" {...register("steelDensityKgM3", numeric)} />
        </Field>
      </div>
      <div className="form-divider" />
      <div className="form-grid provenance-fields">
        <Field label="Data source" error={errors.sourceName?.message}>
          <input {...register("sourceName")} placeholder="Catalogue, manufacturer, or engineer" />
        </Field>
        <Field label="Source reference" error={errors.sourceReference?.message}>
          <input {...register("sourceReference")} placeholder="Document or URL reference" />
        </Field>
        <Field label="Revision" error={errors.revision?.message}>
          <input {...register("revision")} />
        </Field>
        <Field label="Verification status" error={errors.verificationStatus?.message}>
          <select {...register("verificationStatus")}>
            <option value="userProvided">User provided</option>
            <option value="pendingVerification">Pending verification</option>
          </select>
        </Field>
      </div>
      {preview ? (
        <div className="property-preview">
          <div>
            <Calculator size={17} />
            <span>Calculated properties</span>
            <small>Fillets excluded</small>
          </div>
          <dl>
            <Property label="Area" value={convert(preview.area, "cm²")} unit="cm²" />
            <Property label="Ix" value={convert(preview.ix, "cm⁴")} unit="cm⁴" />
            <Property label="Iy" value={convert(preview.iy, "cm⁴")} unit="cm⁴" />
            <Property label="Zx" value={convert(preview.plasticModulusX, "cm³")} unit="cm³" />
            <Property label="Mass" value={preview.massPerMetre.canonicalValue} unit="kg/m" />
          </dl>
        </div>
      ) : (
        <div className="property-preview invalid">
          Complete valid geometry to calculate properties.
        </div>
      )}
      <div className="form-actions">
        <p>Values retain full precision internally. Rounding is applied only in this preview.</p>
        <Button type="submit" disabled={isSubmitting}>
          <Save size={15} />
          Save section
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small>{error}</small>}
    </label>
  );
}
function Property({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        {value.toLocaleString("en-US", { maximumSignificantDigits: 6 })} <small>{unit}</small>
      </dd>
    </div>
  );
}
