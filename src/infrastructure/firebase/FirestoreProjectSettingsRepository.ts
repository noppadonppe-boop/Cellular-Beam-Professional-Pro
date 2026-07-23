import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";
import type { ProjectSettings, ProjectSettingsRepository } from "@/core/projects/settings";
import { projectSettingsSchema } from "@/core/schemas/project-settings";
import { firestoreMenuCollectionPath } from "@/infrastructure/firebase/firestore-paths";

export class FirestoreProjectSettingsRepository implements ProjectSettingsRepository {
  public constructor(private readonly firestore: Firestore) {}
  public async get(projectId: string): Promise<ProjectSettings | null> {
    const snapshot = await getDoc(
      doc(this.firestore, ...firestoreMenuCollectionPath("settings"), projectId),
    );
    return snapshot.exists() ? projectSettingsSchema.parse(snapshot.data()) : null;
  }
  public async save(settings: ProjectSettings): Promise<void> {
    const validated = projectSettingsSchema.parse(settings);
    await setDoc(
      doc(this.firestore, ...firestoreMenuCollectionPath("settings"), settings.projectId),
      validated,
      {
        merge: false,
      },
    );
  }
}
