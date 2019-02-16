// @flow
import type { SQL } from "./write-sql";

const GOLDEN_RATIO = 2654435761;
const THIRTY_TWO_BITS = 4294967296;

export default function sample(sql: SQL, transform: Sample): SQL {
  const { size, limit } = transform;
  const ratio = Math.min(limit / size, 1.0);
  const threshold = Math.floor(THIRTY_TWO_BITS * ratio);

  if (transform.method === "multiplicativeRowid") {
    if (ratio < 1) {
      sql.where.push(
        `((MOD( MOD (${transform.field}, ${THIRTY_TWO_BITS}) * ${GOLDEN_RATIO} , ${THIRTY_TWO_BITS}) < ${threshold}) OR (${transform.field} IN (${transform.expr.join(", ")})))`
      );
    } else {
      sql.where.push(
        `(${transform.field} IN (${transform.expr.join(", ")}))`
      );
    }
  } else if (transform.method === "multiplicative") {
    if (ratio < 1) {
      // We are using simple modulo arithmetic expression conversion, 
      // (A * B) mod C = (A mod C * B mod C) mod C, 
      // to optimize the filter here. This helps  the overflow on the backend.
      // We don't have the full modulo expression for golden ratio since 
      // that is a constant expression and we can avoid that execution
      sql.where.push(
        `MOD( MOD (${sql.from}.rowid, ${THIRTY_TWO_BITS}) * ${GOLDEN_RATIO} , ${THIRTY_TWO_BITS}) < ${threshold}`
      );
    }
  } else if (transform.method === "rowid") {
    sql.where.push(
      `(${transform.field} IN (${transform.expr.join(", ")}))`
    );
  }

  return sql;
}
