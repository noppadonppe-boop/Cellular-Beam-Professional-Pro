import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  type Firestore,
  type QueryConstraint,
} from "firebase/firestore";
import type { SectionQuery, SectionRecord, SectionRepository } from "@/core/sections";
import { sectionRecordDocumentSchema } from "@/core/schemas/engineering";
import { firestoreMenuCollectionPath } from "@/infrastructure/firebase/firestore-paths";

export class FirestoreSectionRepository implements SectionRepository {
  public constructor(private readonly firestore: Firestore) {}

  public async getById(id: string): Promise<SectionRecord | null> {
    const snapshot = await getDoc(
      doc(this.firestore, ...firestoreMenuCollectionPath("sections"), id),
    );
    if (!snapshot.exists()) return null;
    return sectionRecordDocumentSchema.parse(snapshot.data()) as SectionRecord;
  }

  public async list(sectionQuery: SectionQuery = {}): Promise<readonly SectionRecord[]> {
    const constraints: QueryConstraint[] = [];
    if (sectionQuery.verificationStatus)
      constraints.push(
        where("provenance.verificationStatus", "==", sectionQuery.verificationStatus),
      );
    const snapshot = await getDocs(
      query(collection(this.firestore, ...firestoreMenuCollectionPath("sections")), ...constraints),
    );
    const sections = snapshot.docs.map(
      (item) => sectionRecordDocumentSchema.parse(item.data()) as SectionRecord,
    );
    const search = sectionQuery.search?.trim().toLocaleLowerCase();
    return search
      ? sections.filter((section) => section.designation.toLocaleLowerCase().includes(search))
      : sections;
  }

  public async save(section: SectionRecord): Promise<void> {
    const validated = sectionRecordDocumentSchema.parse(section);
    await setDoc(
      doc(this.firestore, ...firestoreMenuCollectionPath("sections"), section.id),
      validated,
      { merge: false },
    );
  }
}
