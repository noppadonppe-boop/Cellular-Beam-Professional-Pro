import type { DiagramSample } from "@/core/loads";

type DiagramKind = "shear" | "moment" | "deflection";

type Props = Readonly<{
  title: string;
  unit: string;
  kind: DiagramKind;
  samples: readonly DiagramSample[];
}>;

const width = 820;
const height = 170;
const padding = 22;

export function LoadDiagramChart({ title, unit, kind, samples }: Props) {
  const values = samples.map((sample) => getValue(sample, kind));
  const maxAbs = Math.max(...values.map(Math.abs), 1);
  const maxX = Math.max(...samples.map((sample) => sample.xM), 1);
  const zeroY = height / 2;
  const points = samples
    .map((sample) => {
      const x = padding + (sample.xM / maxX) * (width - padding * 2);
      const y = zeroY - (getValue(sample, kind) / maxAbs) * (height / 2 - padding);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  return (
    <article className="load-diagram-card">
      <header>
        <div>
          <span className="eyebrow">{kind.toUpperCase()} DIAGRAM</span>
          <h3>{title}</h3>
        </div>
        <span className="mono">
          {formatValue(minValue)} / {formatValue(maxValue)} {unit}
        </span>
      </header>
      <svg viewBox={`0 0 ${String(width)} ${String(height)}`} role="img" aria-label={title}>
        <line x1={padding} x2={width - padding} y1={zeroY} y2={zeroY} className="diagram-zero" />
        <polyline points={points} className={`diagram-line diagram-${kind}`} />
        <text x={padding} y={height - 7}>
          0 m
        </text>
        <text x={width - padding - 35} y={height - 7}>
          {maxX.toFixed(1)} m
        </text>
      </svg>
    </article>
  );
}

function getValue(sample: DiagramSample, kind: DiagramKind): number {
  if (kind === "shear") return sample.shearN / 1000;
  if (kind === "moment") return sample.momentNm / 1000;
  return sample.deflectionM * 1000;
}

function formatValue(value: number): string {
  return Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(3);
}
