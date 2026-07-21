import { FemAnalysisError } from "@/core/fem/models";

export type Matrix = number[][];

export function readVectorValue(vector: readonly number[], index: number, context = "vector"): number {
  const value = vector[index];
  if (value === undefined) throw new FemAnalysisError(`Invalid ${context} access at index ${index.toString()}.`);
  return value;
}

export function readMatrixRow(matrix: Matrix, row: number, context = "matrix"): number[] {
  const values = matrix[row];
  if (!values) throw new FemAnalysisError(`Invalid ${context} row access at index ${row.toString()}.`);
  return values;
}

export function readMatrixValue(matrix: Matrix, row: number, column: number, context = "matrix"): number {
  return readVectorValue(readMatrixRow(matrix, row, context), column, context);
}

export function zeros(rows: number, columns: number): Matrix {
  return Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));
}

export function addMatrix(target: Matrix, source: Matrix, rowOffset: number, columnOffset: number): void {
  for (let row = 0; row < source.length; row += 1) {
    const sourceRow = readMatrixRow(source, row, "source matrix");
    const targetRow = readMatrixRow(target, row + rowOffset, "target matrix");
    for (let column = 0; column < sourceRow.length; column += 1) {
      targetRow[column + columnOffset] =
        readVectorValue(targetRow, column + columnOffset, "target matrix") +
        readVectorValue(sourceRow, column, "source matrix");
    }
  }
}

export function transpose(matrix: Matrix): Matrix {
  const firstRow = matrix[0];
  if (!firstRow) return [];
  return firstRow.map((_, column) => matrix.map((row) => readVectorValue(row, column, "matrix transpose")));
}

export function multiplyMatrix(a: Matrix, b: Matrix): Matrix {
  const bFirstRow = b[0];
  if (!bFirstRow) return zeros(a.length, 0);
  const result = zeros(a.length, bFirstRow.length);
  for (let row = 0; row < a.length; row += 1) {
    const aRow = readMatrixRow(a, row, "left matrix");
    const resultRow = readMatrixRow(result, row, "result matrix");
    for (let column = 0; column < bFirstRow.length; column += 1) {
      let sum = 0;
      for (let inner = 0; inner < b.length; inner += 1) {
        sum +=
          readVectorValue(aRow, inner, "left matrix") *
          readMatrixValue(b, inner, column, "right matrix");
      }
      resultRow[column] = sum;
    }
  }
  return result;
}

export function multiplyMatrixVector(matrix: Matrix, vector: readonly number[]): number[] {
  return matrix.map((row) =>
    row.reduce((sum, value, index) => sum + value * readVectorValue(vector, index), 0),
  );
}

export function solveLinearSystem(matrix: Matrix, rhs: readonly number[]): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  if (matrix.some((row) => row.length !== n) || rhs.length !== n) {
    throw new FemAnalysisError("Linear system dimensions are inconsistent.");
  }
  const augmented = matrix.map((row, index) => [...row, readVectorValue(rhs, index, "right-hand side")]);

  for (let pivot = 0; pivot < n; pivot += 1) {
    let pivotRow = pivot;
    for (let row = pivot + 1; row < n; row += 1) {
      if (
        Math.abs(readMatrixValue(augmented, row, pivot, "augmented matrix")) >
        Math.abs(readMatrixValue(augmented, pivotRow, pivot, "augmented matrix"))
      ) {
        pivotRow = row;
      }
    }
    if (Math.abs(readMatrixValue(augmented, pivotRow, pivot, "augmented matrix")) < 1e-14) {
      throw new FemAnalysisError("Stiffness matrix is singular. Check restraints and disconnected nodes.");
    }
    if (pivotRow !== pivot) {
      const currentPivotRow = readMatrixRow(augmented, pivot, "augmented matrix");
      augmented[pivot] = readMatrixRow(augmented, pivotRow, "augmented matrix");
      augmented[pivotRow] = currentPivotRow;
    }

    const pivotRowValues = readMatrixRow(augmented, pivot, "augmented matrix");
    const pivotValue = readVectorValue(pivotRowValues, pivot, "augmented matrix");
    for (let column = pivot; column <= n; column += 1) {
      pivotRowValues[column] = readVectorValue(pivotRowValues, column, "augmented matrix") / pivotValue;
    }

    for (let row = 0; row < n; row += 1) {
      if (row === pivot) continue;
      const rowValues = readMatrixRow(augmented, row, "augmented matrix");
      const factor = readVectorValue(rowValues, pivot, "augmented matrix");
      for (let column = pivot; column <= n; column += 1) {
        rowValues[column] =
          readVectorValue(rowValues, column, "augmented matrix") -
          factor * readVectorValue(pivotRowValues, column, "augmented matrix");
      }
    }
  }

  return augmented.map((row) => readVectorValue(row, n, "augmented matrix"));
}
