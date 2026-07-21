import { describe, expect, it } from "vitest";
import {
  analyzeLinearFrame2D,
  createCantileverBeamModel,
  createSimplySupportedBeamModel,
  FemAnalysisError,
  localFrameStiffness,
} from "@/core/fem";
import { readMatrixValue } from "@/core/fem/matrix";

const elasticModulusPa = 200_000_000_000;
const areaM2 = 0.012;
const inertiaM4 = 8.5e-5;

describe("2D linear frame FEM solver", () => {
  it("builds a symmetric Euler-Bernoulli local stiffness matrix", () => {
    const matrix = localFrameStiffness(
      {
        id: "E1",
        startNodeId: "N1",
        endNodeId: "N2",
        areaM2,
        inertiaM4,
        elasticModulusPa,
      },
      6,
    );

    for (let row = 0; row < matrix.length; row += 1) {
      for (let column = 0; column < matrix.length; column += 1) {
        expect(readMatrixValue(matrix, row, column)).toBeCloseTo(
          readMatrixValue(matrix, column, row),
          10,
        );
      }
    }
  });

  it("returns equal reactions for a simply supported beam with a centre point load", () => {
    const loadN = 100_000;
    const result = analyzeLinearFrame2D({
      ...createSimplySupportedBeamModel({
        lengthM: 10,
        elementCount: 2,
        areaM2,
        inertiaM4,
        elasticModulusPa,
      }),
      nodalLoads: [{ nodeId: "N2", fyN: -loadN }],
    });

    expect(result.reactions.find((item) => item.nodeId === "N1")?.fyN).toBeCloseTo(loadN / 2, 7);
    expect(result.reactions.find((item) => item.nodeId === "N3")?.fyN).toBeCloseTo(loadN / 2, 7);
  });

  it("matches closed-form midspan deflection for a centre point load", () => {
    const lengthM = 10;
    const loadN = 100_000;
    const result = analyzeLinearFrame2D({
      ...createSimplySupportedBeamModel({
        lengthM,
        elementCount: 2,
        areaM2,
        inertiaM4,
        elasticModulusPa,
      }),
      nodalLoads: [{ nodeId: "N2", fyN: -loadN }],
    });

    const expected = (-loadN * lengthM ** 3) / (48 * elasticModulusPa * inertiaM4);
    expect(result.displacements.find((item) => item.nodeId === "N2")?.uyM).toBeCloseTo(
      expected,
      12,
    );
  });

  it("matches closed-form reactions and deflection for a simply supported UDL", () => {
    const lengthM = 8;
    const loadNPerM = 18_000;
    const model = createSimplySupportedBeamModel({
      lengthM,
      elementCount: 8,
      areaM2,
      inertiaM4,
      elasticModulusPa,
    });
    const result = analyzeLinearFrame2D({
      ...model,
      uniformElementLoads: model.elements.map((element) => ({
        elementId: element.id,
        localYNPerM: -loadNPerM,
      })),
    });

    const expectedDeflection =
      (-5 * loadNPerM * lengthM ** 4) / (384 * elasticModulusPa * inertiaM4);
    expect(result.reactions.find((item) => item.nodeId === "N1")?.fyN).toBeCloseTo(
      (loadNPerM * lengthM) / 2,
      7,
    );
    expect(result.displacements.find((item) => item.nodeId === "N5")?.uyM).toBeCloseTo(
      expectedDeflection,
      12,
    );
  });

  it("matches closed-form cantilever tip-load response", () => {
    const lengthM = 4;
    const loadN = 50_000;
    const result = analyzeLinearFrame2D({
      ...createCantileverBeamModel({
        lengthM,
        elementCount: 1,
        areaM2,
        inertiaM4,
        elasticModulusPa,
      }),
      nodalLoads: [{ nodeId: "N2", fyN: -loadN }],
    });

    const expectedDeflection = (-loadN * lengthM ** 3) / (3 * elasticModulusPa * inertiaM4);
    expect(result.displacements.find((item) => item.nodeId === "N2")?.uyM).toBeCloseTo(
      expectedDeflection,
      12,
    );
    expect(result.reactions.find((item) => item.nodeId === "N1")?.mzNm).toBeCloseTo(
      loadN * lengthM,
      7,
    );
  });

  it("rejects unstable models with a singular stiffness matrix", () => {
    expect(() =>
      analyzeLinearFrame2D({
        ...createSimplySupportedBeamModel({
          lengthM: 6,
          elementCount: 1,
          areaM2,
          inertiaM4,
          elasticModulusPa,
        }),
        restraints: [],
      }),
    ).toThrow(FemAnalysisError);
  });
});
