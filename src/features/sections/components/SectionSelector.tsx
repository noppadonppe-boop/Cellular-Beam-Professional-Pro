import { Database, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { SectionRecord } from "@/core/sections";

type Props = {
  sections: readonly SectionRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};
export function SectionSelector({ sections, selectedId, onSelect }: Props) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      sections.filter((item) =>
        item.designation.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
    [search, sections],
  );
  return (
    <section className="section-selector">
      <div className="selector-heading">
        <div>
          <span className="eyebrow">SECTION DATABASE</span>
          <h2>Available sections</h2>
        </div>
        <span>{sections.length} records</span>
      </div>
      <label className="search-box">
        <Search size={15} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search designation"
        />
      </label>
      {filtered.length === 0 ? (
        <div className="selector-empty">
          <Database size={24} />
          <strong>No section records</strong>
          <p>
            Create a custom section. Verified catalogue records will require an approved source and
            revision.
          </p>
        </div>
      ) : (
        <div className="section-list">
          {filtered.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className={section.id === selectedId ? "selected" : ""}
            >
              <div>
                <strong>{section.designation}</strong>
                <span>
                  {section.geometry.depth.rawValue} × {section.geometry.flangeWidth.rawValue} ×{" "}
                  {section.geometry.webThickness.rawValue} ×{" "}
                  {section.geometry.flangeThickness.rawValue} mm
                </span>
              </div>
              <span className={`verification-badge ${section.provenance.verificationStatus}`}>
                {statusLabel[section.provenance.verificationStatus]}
              </span>
              <dl>
                <div>
                  <dt>Source</dt>
                  <dd>{section.provenance.sourceName}</dd>
                </div>
                <div>
                  <dt>Revision</dt>
                  <dd>{section.provenance.revision}</dd>
                </div>
              </dl>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
const statusLabel = {
  verified: "VERIFIED",
  userProvided: "USER PROVIDED",
  pendingVerification: "PENDING",
} as const;
