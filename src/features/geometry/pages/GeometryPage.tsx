import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { generateCellularGeometry } from "@/core/cellular";
import {
  cellularGeometryInputSchema,
  type CellularGeometryFormValues,
} from "@/core/schemas/cellular-geometry";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthProvider";
import { BeamElevationSvg } from "@/features/geometry/components/BeamElevationSvg";
import { GeometryInputForm } from "@/features/geometry/components/GeometryInputForm";
import { GeometrySummary } from "@/features/geometry/components/GeometrySummary";
import { useNotificationStore } from "@/stores/notification-store";

const defaults: CellularGeometryFormValues = {
  beamLengthMm: 12000,
  parentDepthMm: 400,
  flangeWidthMm: 200,
  flangeThicknessMm: 16,
  webThicknessMm: 10,
  finishedDepthMm: 600,
  openingDiameterMm: 400,
  pitchMm: 600,
  firstOpeningCenterMm: 700,
  openingCount: 18,
  openingEccentricityMm: 0,
  minimumSolidEndZoneMm: 400,
  steelDensityKgM3: 7850,
  weldSizeMm: 6,
  cuttingPattern: "circular-interlock",
  weldType: "continuous-fillet",
};

export default function GeometryPage() {
  const { projectId = "demo-project" } = useParams();
  const { user } = useAuth();
  const notify = useNotificationStore((state) => state.notify);
  const [selectedOpening, setSelectedOpening] = useState<number | null>(1);
  const [saving, setSaving] = useState(false);
  const form = useForm<CellularGeometryFormValues>({
    resolver: zodResolver(cellularGeometryInputSchema),
    defaultValues: defaults,
    mode: "onChange",
  });
  const watched = useWatch({ control: form.control });
  const geometry = useMemo(() => generateCellularGeometry({ ...defaults, ...watched }), [watched]);

  const save = form.handleSubmit(async (values) => {
    if (!geometry.isValid) {
      notify({
        title: "Geometry not saved",
        message: "Resolve geometric errors before saving.",
        tone: "error",
      });
      return;
    }
    setSaving(true);
    try {
      const [{ initializeFirebase }, { FirestoreCellularGeometryRepository }] = await Promise.all([
        import("@/lib/firebase"),
        import("@/infrastructure/firebase/FirestoreCellularGeometryRepository"),
      ]);
      const firebase = initializeFirebase();
      if (!firebase) throw new Error("Firebase environment is not configured.");
      const validatedGeometry = generateCellularGeometry(values);
      await new FirestoreCellularGeometryRepository(firebase.db).saveDraft(
        projectId,
        validatedGeometry,
        user?.uid ?? "anonymous",
      );
      notify({
        title: "Geometry saved",
        message: "The validated draft was saved to this project.",
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Save failed",
        message: error instanceof Error ? error.message : "Unable to save geometry.",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="page geometry-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">MODEL DEFINITION · PHASE 4</span>
          <h1>Cellular Geometry Generator</h1>
          <p>
            Deterministic straight-beam geometry in SI canonical units. No structural capacity is
            inferred.
          </p>
        </div>
        <Button onClick={() => void save()} disabled={saving || !geometry.isValid}>
          <Save size={15} />
          {saving ? "Saving…" : "Save geometry"}
        </Button>
      </header>
      <div className="geometry-workspace">
        <GeometryInputForm register={form.register} errors={form.formState.errors} />
        <main className="geometry-output">
          <BeamElevationSvg
            geometry={geometry}
            selectedOpening={selectedOpening}
            onSelectOpening={setSelectedOpening}
          />
          <div className="geometry-table-card">
            <header>
              <h2>Opening schedule</h2>
              <span>
                {geometry.openings.length} openings · {geometry.webPosts.length} web posts
              </span>
            </header>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Centre x</th>
                    <th>Diameter</th>
                    <th>Left edge</th>
                    <th>Right edge</th>
                    <th>Geometry</th>
                  </tr>
                </thead>
                <tbody>
                  {geometry.openings.map((opening) => {
                    const hasError = geometry.issues.some(
                      (issue) =>
                        issue.openingNumber === opening.number && issue.severity === "error",
                    );
                    return (
                      <tr
                        key={opening.number}
                        onClick={() => setSelectedOpening(opening.number)}
                        className={selectedOpening === opening.number ? "selected" : ""}
                      >
                        <td>
                          <strong>O{opening.number}</strong>
                        </td>
                        <td>{(opening.centerXM * 1000).toFixed(1)} mm</td>
                        <td>{(opening.diameterM * 1000).toFixed(1)} mm</td>
                        <td>{(opening.leftEdgeM * 1000).toFixed(1)} mm</td>
                        <td>{(opening.rightEdgeM * 1000).toFixed(1)} mm</td>
                        <td>
                          <span className={hasError ? "schedule-error" : "schedule-valid"}>
                            {hasError ? "ERROR" : "VALID"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <GeometrySummary geometry={geometry} selectedOpening={selectedOpening} />
      </div>
    </div>
  );
}
