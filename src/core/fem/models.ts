export type FemNode = Readonly<{
  id: string;
  xM: number;
  yM: number;
}>;

export type FemFrameElement = Readonly<{
  id: string;
  startNodeId: string;
  endNodeId: string;
  areaM2: number;
  inertiaM4: number;
  elasticModulusPa: number;
}>;

export type FemRestraint = Readonly<{
  nodeId: string;
  ux?: boolean;
  uy?: boolean;
  rz?: boolean;
}>;

export type FemNodalLoad = Readonly<{
  nodeId: string;
  fxN?: number;
  fyN?: number;
  mzNm?: number;
}>;

export type FemUniformElementLoad = Readonly<{
  elementId: string;
  localXNPerM?: number;
  localYNPerM?: number;
}>;

export type FemAnalysisInput = Readonly<{
  nodes: readonly FemNode[];
  elements: readonly FemFrameElement[];
  restraints: readonly FemRestraint[];
  nodalLoads?: readonly FemNodalLoad[];
  uniformElementLoads?: readonly FemUniformElementLoad[];
}>;

export type FemNodeDisplacement = Readonly<{
  nodeId: string;
  uxM: number;
  uyM: number;
  rzRad: number;
}>;

export type FemReaction = Readonly<{
  nodeId: string;
  fxN: number;
  fyN: number;
  mzNm: number;
}>;

export type FemElementEndForces = Readonly<{
  elementId: string;
  start: Readonly<{
    axialN: number;
    shearN: number;
    momentNm: number;
  }>;
  end: Readonly<{
    axialN: number;
    shearN: number;
    momentNm: number;
  }>;
}>;

export type FemAnalysisResult = Readonly<{
  displacements: readonly FemNodeDisplacement[];
  reactions: readonly FemReaction[];
  elementEndForces: readonly FemElementEndForces[];
  maximumVerticalDisplacementM: number;
  solverVersion: "linear-frame-2d-1.0.0";
}>;

export class FemAnalysisError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "FemAnalysisError";
  }
}
