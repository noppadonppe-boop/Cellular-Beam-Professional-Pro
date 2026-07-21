import type { FemAnalysisInput, FemAnalysisResult } from "@/core/fem";

export type LoadCategory =
  | "dead"
  | "superimposedDead"
  | "live"
  | "roofLive"
  | "wind"
  | "rain"
  | "seismic"
  | "equipment"
  | "mep"
  | "construction"
  | "userDefined";

export type LoadDirection = "gravity" | "uplift";

export type PointLoad = Readonly<{
  id: string;
  type: "point";
  positionXM: number;
  fyN: number;
  label: string;
}>;

export type UniformLoad = Readonly<{
  id: string;
  type: "uniform";
  startXM: number;
  endXM: number;
  magnitudeNPerM: number;
  label: string;
}>;

export type StraightBeamLoad = PointLoad | UniformLoad;

export type StraightBeamLoadCase = Readonly<{
  id: string;
  name: string;
  category: LoadCategory;
  direction: LoadDirection;
  loads: readonly StraightBeamLoad[];
  includeSelfWeight: boolean;
  source: "userDefined" | "benchmark" | "automatic";
  revision: string;
}>;

export type StraightBeamAnalysisInput = Readonly<{
  beamLengthM: number;
  areaM2: number;
  inertiaM4: number;
  elasticModulusPa: number;
  steelDensityKgM3: number;
  loadCase: StraightBeamLoadCase;
  minimumElementCount?: number;
}>;

export type DiagramSample = Readonly<{
  xM: number;
  axialN: number;
  shearN: number;
  momentNm: number;
  deflectionM: number;
  rotationRad: number;
}>;

export type DiagramExtrema = Readonly<{
  maxShearN: DiagramSample;
  minShearN: DiagramSample;
  maxMomentNm: DiagramSample;
  minMomentNm: DiagramSample;
  maxDeflectionM: DiagramSample;
  minDeflectionM: DiagramSample;
}>;

export type StraightBeamAnalysis = Readonly<{
  femInput: FemAnalysisInput;
  femResult: FemAnalysisResult;
  samples: readonly DiagramSample[];
  extrema: DiagramExtrema;
  totalVerticalLoadN: number;
  loadCase: StraightBeamLoadCase;
  analysisVersion: "straight-load-diagrams-1.0.0";
}>;

export class LoadCaseError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "LoadCaseError";
  }
}
