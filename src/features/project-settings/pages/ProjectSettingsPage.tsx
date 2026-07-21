import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { projectSettingsSchema, type ProjectSettingsInput } from "@/core/schemas/project-settings";
import { useAuth } from "@/features/auth/AuthProvider";
import { useNotificationStore } from "@/stores/notification-store";

const today = new Date().toISOString().slice(0, 10);

export default function ProjectSettingsPage() {
  const { projectId = "" } = useParams();
  const { user, status } = useAuth();
  const notify = useNotificationStore((state) => state.notify);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectSettingsInput>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      projectId,
      organizationId: "",
      general: {
        name: "",
        number: "",
        client: "",
        owner: "",
        siteLocation: "",
        buildingType: "",
        designer: "",
        checker: "",
        approver: "",
        revision: "0",
        calculationDateIso: today,
        notes: "",
      },
      standards: {
        country: "TH",
        primaryCode: "",
        secondaryGuidance: "",
        designMethod: "LRFD",
        standardEdition: "",
        loadStandard: "",
        steelStandard: "",
        weldingStandard: "AWS D1.1",
        reportLanguage: "bilingual",
      },
      materials: {
        steelGrade: "",
        weldElectrode: "",
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
        unbracedLength: { value: 0, unit: "m" },
        effectiveLengthFactor: 1,
        deflectionLimitRatio: 360,
        designLifeYears: 50,
        exposureCondition: "",
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
        reportTitle: "Engineering Calculation Report",
        confidentiality: "confidential",
      },
      updatedAtIso: new Date().toISOString(),
      updatedBy: user?.uid ?? "unconfigured-user",
    },
  });
  const save = async (input: ProjectSettingsInput) => {
    const snapshot = projectSettingsSchema.parse({
      ...input,
      updatedAtIso: new Date().toISOString(),
      updatedBy: user?.uid ?? "unconfigured-user",
    });
    const [{ initializeFirebase }, { FirestoreProjectSettingsRepository }] = await Promise.all([
      import("@/lib/firebase"),
      import("@/infrastructure/firebase/FirestoreProjectSettingsRepository"),
    ]);
    const firebase = initializeFirebase();
    if (!firebase || !user) {
      notify({
        tone: "warning",
        title: "Not persisted",
        message: "Configure Firebase and sign in to save project settings.",
      });
      return;
    }
    try {
      await new FirestoreProjectSettingsRepository(firebase.db).save(snapshot);
      notify({
        tone: "success",
        title: "Project settings saved",
        message: "The immutable settings snapshot passed schema and Firestore security checks.",
      });
    } catch (error) {
      notify({
        tone: "error",
        title: "Save denied",
        message: error instanceof Error ? error.message : "Firestore rejected the write.",
      });
    }
  };
  const n = { valueAsNumber: true } as const;
  return (
    <div className="page wide-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">PROJECT GOVERNANCE</span>
          <h1>Project Settings</h1>
          <p>
            Validated design basis, analysis controls, units, and report identity for project{" "}
            {projectId}.
          </p>
        </div>
        <span className={`auth-chip ${status}`}>
          <ShieldCheck size={14} />
          {status}
        </span>
      </header>
      <form
        className="project-settings-form"
        onSubmit={(event) => {
          void handleSubmit(save)(event);
        }}
      >
        <SettingsSection title="General">
          <Field label="Project name" error={errors.general?.name?.message}>
            <input {...register("general.name")} />
          </Field>
          <Field label="Project number" error={errors.general?.number?.message}>
            <input {...register("general.number")} />
          </Field>
          <Field label="Organization ID" error={errors.organizationId?.message}>
            <input {...register("organizationId")} />
          </Field>
          <Field label="Client">
            <input {...register("general.client")} />
          </Field>
          <Field label="Site location">
            <input {...register("general.siteLocation")} />
          </Field>
          <Field label="Revision">
            <input {...register("general.revision")} />
          </Field>
        </SettingsSection>
        <SettingsSection title="Standards">
          <Field label="Country">
            <select {...register("standards.country")}>
              <option value="TH">Thailand</option>
              <option value="US">United States</option>
              <option value="EU">European Union</option>
            </select>
          </Field>
          <Field label="Design method">
            <select {...register("standards.designMethod")}>
              <option>LRFD</option>
              <option>ASD</option>
              <option>EUROCODE</option>
            </select>
          </Field>
          <Field label="Primary code" error={errors.standards?.primaryCode?.message}>
            <input {...register("standards.primaryCode")} />
          </Field>
          <Field label="Edition" error={errors.standards?.standardEdition?.message}>
            <input {...register("standards.standardEdition")} />
          </Field>
          <Field label="Load standard">
            <input {...register("standards.loadStandard")} />
          </Field>
          <Field label="Steel standard">
            <input {...register("standards.steelStandard")} />
          </Field>
        </SettingsSection>
        <SettingsSection title="Materials">
          <Field label="Steel grade">
            <input {...register("materials.steelGrade")} />
          </Field>
          <Field label="Weld electrode">
            <input {...register("materials.weldElectrode")} />
          </Field>
          <Field label="Steel density (kg/m³)">
            <input type="number" {...register("materials.steelDensity.value", n)} />
          </Field>
          <Field label="Corrosion allowance (mm)">
            <input
              type="number"
              step="any"
              {...register("materials.corrosionAllowance.value", n)}
            />
          </Field>
          <Field label="Temperature (°C)">
            <input type="number" step="any" {...register("materials.temperature.value", n)} />
          </Field>
        </SettingsSection>
        <SettingsSection title="Analysis & Design">
          <Field label="Analysis order">
            <select {...register("analysis.analysisOrder")}>
              <option value="firstOrder">First order</option>
              <option value="secondOrder">Second order</option>
            </select>
          </Field>
          <Field label="Element formulation">
            <select {...register("analysis.elementFormulation")}>
              <option value="eulerBernoulli">Euler-Bernoulli</option>
              <option value="timoshenko">Timoshenko</option>
            </select>
          </Field>
          <Field label="Solver tolerance">
            <input type="number" step="any" {...register("analysis.solverTolerance", n)} />
          </Field>
          <Field label="Unbraced length (m)">
            <input type="number" step="any" {...register("design.unbracedLength.value", n)} />
          </Field>
          <Field label="Deflection L/">
            <input type="number" {...register("design.deflectionLimitRatio", n)} />
          </Field>
          <Field label="Design life (years)">
            <input type="number" {...register("design.designLifeYears", n)} />
          </Field>
        </SettingsSection>
        <SettingsSection title="Units & Report">
          <Field label="Unit profile">
            <select {...register("units.profile")}>
              <option value="thaiEngineeringMetric">Thai Engineering Metric</option>
              <option value="siEngineering">SI Engineering</option>
            </select>
          </Field>
          <Field label="Significant figures">
            <input type="number" {...register("units.significantFigures", n)} />
          </Field>
          <Field label="Report language">
            <select {...register("standards.reportLanguage")}>
              <option value="bilingual">Thai + English</option>
              <option value="th">Thai</option>
              <option value="en">English</option>
            </select>
          </Field>
          <Field label="Company">
            <input {...register("report.companyName")} />
          </Field>
          <Field label="Engineer license">
            <input {...register("report.licenseNumber")} />
          </Field>
          <Field label="Confidentiality">
            <select {...register("report.confidentiality")}>
              <option value="confidential">Confidential</option>
              <option value="internal">Internal</option>
              <option value="public">Public</option>
            </select>
          </Field>
        </SettingsSection>
        <div className="settings-save">
          <p>
            Firestore Rules require projectAdmin or designer membership. Approval cannot be
            automated.
          </p>
          <Button type="submit" disabled={isSubmitting}>
            <Save size={15} />
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="settings-section">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
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
