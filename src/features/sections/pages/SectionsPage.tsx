import { useState } from "react";
import type { CustomISectionInput } from "@/core/schemas/engineering";
import { createCustomSectionRecord, type SectionRecord } from "@/core/sections";
import { useNotificationStore } from "@/stores/notification-store";
import { CustomSectionForm } from "@/features/sections/components/CustomSectionForm";
import { SectionSelector } from "@/features/sections/components/SectionSelector";

export default function SectionsPage() {
  const [sections, setSections] = useState<readonly SectionRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const notify = useNotificationStore((state) => state.notify);
  const onSave = async (input: CustomISectionInput) => {
    const timestamp = new Date().toISOString();
    const section = createCustomSectionRecord(input, crypto.randomUUID(), timestamp);
    const [{ initializeFirebase }, { FirestoreSectionRepository }] = await Promise.all([
      import("@/lib/firebase"),
      import("@/infrastructure/firebase/FirestoreSectionRepository"),
    ]);
    const firebase = initializeFirebase();
    if (firebase) {
      await new FirestoreSectionRepository(firebase.db).save(section);
      notify({
        tone: "success",
        title: "Section saved",
        message: `${section.designation} was saved to Firestore with unit metadata.`,
      });
    } else {
      notify({
        tone: "warning",
        title: "Session preview only",
        message: "Firebase is not configured; the section was not persisted.",
      });
    }
    setSections((current) => [section, ...current]);
    setSelectedId(section.id);
  };
  return (
    <div className="page wide-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">ENGINEERING FOUNDATION</span>
          <h1>Steel Sections</h1>
          <p>
            Create dimensionally validated I-sections with traceable sources, revisions, and
            verification status.
          </p>
        </div>
        <span className="phase-badge">PHASE 2</span>
      </header>
      <div className="sections-layout">
        <CustomSectionForm onSave={onSave} />
        <SectionSelector sections={sections} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
