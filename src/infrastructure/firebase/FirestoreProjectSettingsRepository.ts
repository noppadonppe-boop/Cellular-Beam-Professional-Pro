import { doc, getDoc, setDoc, type Firestore } from "firebase/firestore";
import type { ProjectSettings, ProjectSettingsRepository } from "@/core/projects/settings";
import { projectSettingsSchema } from "@/core/schemas/project-settings";

export class FirestoreProjectSettingsRepository implements ProjectSettingsRepository {
  public constructor(private readonly firestore: Firestore) {}
  public async get(projectId: string): Promise<ProjectSettings | null> {
    const snapshot = await getDoc(doc(this.firestore, "projectSettings", projectId));
    return snapshot.exists() ? projectSettingsSchema.parse(snapshot.data()) : null;
  }
  public async save(settings: ProjectSettings): Promise<void> {
    const validated = projectSettingsSchema.parse(settings);
    await setDoc(doc(this.firestore, "projectSettings", settings.projectId), validated, {
      merge: false,
    });
  }
}
