import type { CellularGeometryResult } from "@/core/cellular";

type Props = Readonly<{
  geometry: CellularGeometryResult;
  selectedOpening: number | null;
  onSelectOpening: (openingNumber: number) => void;
}>;

export function BeamElevationSvg({ geometry, selectedOpening, onSelectOpening }: Props) {
  const width = 1200;
  const height = 330;
  const left = 70;
  const right = 1130;
  const beamWidth = right - left;
  const beamTop = 105;
  const beamHeight = 130;
  const x = (metres: number) => left + (metres / geometry.beamLengthM) * beamWidth;
  const diameter = Math.max(
    8,
    (geometry.input.openingDiameterMm / geometry.input.finishedDepthMm) * beamHeight,
  );
  const openingY =
    beamTop +
    beamHeight / 2 -
    (geometry.input.openingEccentricityMm / geometry.input.finishedDepthMm) * beamHeight;

  return (
    <div className="geometry-drawing">
      <svg viewBox="0 0 1200 330" role="img" aria-label="Dimensioned cellular beam elevation">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeOpacity="0.08" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        <line x1={left} y1="55" x2={right} y2="55" className="dimension-line" />
        <line x1={left} y1="45" x2={left} y2="70" className="dimension-line" />
        <line x1={right} y1="45" x2={right} y2="70" className="dimension-line" />
        <text x={width / 2} y="42" textAnchor="middle">
          L = {(geometry.beamLengthM * 1000).toLocaleString()} mm
        </text>
        <rect
          x={left}
          y={beamTop}
          width={beamWidth}
          height={beamHeight}
          rx="2"
          className="beam-web"
        />
        {geometry.openings.map((opening) => (
          <g
            key={opening.number}
            role="button"
            tabIndex={0}
            aria-label={`Opening O${String(opening.number)}`}
            onClick={() => onSelectOpening(opening.number)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onSelectOpening(opening.number);
            }}
          >
            <circle
              cx={x(opening.centerXM)}
              cy={openingY}
              r={diameter / 2}
              className={
                selectedOpening === opening.number ? "beam-opening selected" : "beam-opening"
              }
            />
            <text
              x={x(opening.centerXM)}
              y={openingY + 4}
              textAnchor="middle"
              className="opening-label"
            >
              O{opening.number}
            </text>
          </g>
        ))}
        <path d="M 52 270 L 88 270 L 70 238 Z" className="support-shape" />
        <path d="M 1112 270 L 1148 270 L 1130 238 Z" className="support-shape" />
        <line
          x1={left}
          y1="295"
          x2={x(geometry.openings[0]?.centerXM ?? 0)}
          y2="295"
          className="dimension-line"
        />
        <text x={(left + x(geometry.openings[0]?.centerXM ?? 0)) / 2} y="315" textAnchor="middle">
          first centre {geometry.input.firstOpeningCenterMm.toLocaleString()} mm
        </text>
      </svg>
      <div className="drawing-legend">
        <span>
          <i className="legend-opening" /> Opening
        </span>
        <span>
          <i className="legend-solid" /> Solid web
        </span>
        <span>Click an opening to inspect its coordinates</span>
      </div>
    </div>
  );
}
