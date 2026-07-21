import { BadgeCheck, Scale, Weight } from "lucide-react";
import type { StraightBeamAnalysis } from "@/core/loads";

type Props = Readonly<{
  analysis: StraightBeamAnalysis;
}>;

export function LoadCaseSummary({ analysis }: Props) {
  const leftReaction =
    analysis.femResult.reactions.find((reaction) => reaction.nodeId === "N1")?.fyN ?? 0;
  const rightReaction =
    analysis.femResult.reactions.find(
      (reaction) => reaction.nodeId === `N${String(analysis.femInput.nodes.length)}`,
    )?.fyN ?? 0;

  return (
    <aside className="load-side-panel">
      <header>
        <Scale size={17} />
        <div>
          <span className="eyebrow">LOAD CASE</span>
          <h2>{analysis.loadCase.name}</h2>
        </div>
      </header>
      <dl>
        <div>
          <dt>Category</dt>
          <dd>{formatCategory(analysis.loadCase.category)}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>
            {analysis.loadCase.source === "benchmark" ? "DEMO BENCHMARK" : analysis.loadCase.source}
          </dd>
        </div>
        <div>
          <dt>Total vertical load</dt>
          <dd>{formatForce(analysis.totalVerticalLoadN)}</dd>
        </div>
        <div>
          <dt>Left reaction</dt>
          <dd>{formatForce(leftReaction)}</dd>
        </div>
        <div>
          <dt>Right reaction</dt>
          <dd>{formatForce(rightReaction)}</dd>
        </div>
      </dl>
      <div className="load-source-list">
        <div>
          <BadgeCheck size={15} />
          <strong>Diagram engine</strong>
          <span>{analysis.analysisVersion}</span>
        </div>
        {analysis.loadCase.loads.map((load) => (
          <article key={load.id}>
            <Weight size={14} />
            <div>
              <strong>{load.label}</strong>
              <span>
                {load.type === "uniform"
                  ? formatUniform(load.magnitudeNPerM)
                  : formatForce(load.fyN)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

function formatCategory(category: string): string {
  return category.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
}

function formatForce(valueN: number): string {
  return `${(valueN / 1000).toFixed(3)} kN`;
}

function formatUniform(valueNPerM: number): string {
  return `${(valueNPerM / 1000).toFixed(3)} kN/m`;
}
