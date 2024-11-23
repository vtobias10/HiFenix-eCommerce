/* eslint-disable prettier/prettier */
// src/common/transformers/column-numeric.transformer.ts
export class ColumnNumericTransformer {
  to(value: number | null): number | null {
    return value;
  }
  from(value: string | null): number | null {
    return value === null ? null : parseFloat(value);
  }
}
