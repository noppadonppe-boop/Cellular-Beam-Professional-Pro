import { doc, setDoc, type Firestore } from "firebase/firestore";
import type { CellularGeometryResult } from "@/core/cellular";

export class FirestoreCellularGeometryRepository {
  public constructor(private readonly firestore: Firestore) {}

  public async saveDraft(
    projectId: string,
    geometry: CellularGeometryResult,
    userId: string,
  ): Promise<void> {
    await setDoc(doc(this.firestore, "cellularGeometries", `${projectId}_current`), {
      projectId,
      status: "draft",
      input: geometry.input,
      generated: geometry,
      generatorVersion: geometry.generatorVersion,
      updatedBy: userId,
      updatedAtIso: new Date().toISOString(),
    });
  }
}
