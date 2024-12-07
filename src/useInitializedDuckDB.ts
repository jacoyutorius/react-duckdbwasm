import { type AsyncDuckDB, insertCSV, useDuckDb } from "duckdb-wasm-kit";
import { useAsync } from "react-use";

const DATA_CSV_FILE_PATH = "https://hamait-jacoyutorius.s3.ap-northeast-1.amazonaws.com/utf_ken_all.csv?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0xIkcwRQIhAIldtQkOXDkGC7dxb%2F3k67QcMYPUAhiMIhe5pw0%2BfDojAiAiqUNEnRlhNe2nD%2FBWZ1rEdv2ax8KEZMrJ1EN5HO6iuSrLAwhAEAMaDDg2NTQyMjk4NTU0MSIM1XZzMwF1EG5IsjY2KqgDbDgW2V%2FQT3G3rEitzQB8vKgJekwB0M3Tv0UiZpkEAnSPBsNKcLzdZbCZ%2BVEt%2Fz5gxsBdfNUsHzIZfkE4zzlCOzIuTYI%2Fd%2BqMsypWVgv5f4M18dJgLuu6%2B9HdAao6pdFY8EuBXeH55CpLwCuBejMj%2BQsVhqjW7nQcfktEQATb1F9iQAoth7CKqKWi2N8hSdVRMpTJ0ZuNk82RgMVE5XMhn4pePQu06Pic8V%2Bj78GWcxxorgPMxLyRMMPgQvN8Rs9JtQWXQJF4cMzgnZYB1OQpj2Fb9GV3cAgrCRK0yRHChGHFNoHkkLXNOGTj6EI6Krey9CO20PE6NkGc5g96sjjro21yV8w0OUVOwFTNd7q%2FVPgo%2FD%2FNlXfdReHKffkWI8DXl5A%2BGHWxoXqbUdMVjs4M5KeY19ewy%2BNfPO%2BV1eBsEwfp%2FNOKuyyfWDrz4FfhB3btOLsNe7kx13bAuzdB7wEfzqm0N%2BQfTp3wGz0Q8bUBNRNL%2FLP4CQclEVsZfgD466lOgoEn5pWTYhb%2FANnptwsCDBr%2FcHas5trFsmBOlDWMMyjGquc%2BZFhZaTDP0M%2B6BjrkAj76xbHrHSMYw2O9As6a3%2BrOnKZnKJrx67amsgJiZ0wtcT3wSG32V1Z0VoaROwAcABleClF8AYEPo%2BEuaVuGCwwyYyJOU90uJSci6mV%2F%2BvrYQQw%2F%2BSJ7dgogbMwNdY7%2FwRv2nzYEPJEzkQJpZc8KugiO2s5PqPEN5DCkRmwC%2BJbEA2DO0DWh6P%2BDzBMhe59vx0fdIcdZP%2FIi57pQgDQ0pIdgMhgMd54bNUIOGDUmoku5eHQ9KPmm9I7s0kxL77jCcl1IAow2R3%2BdmyXx5iW3oCu%2BDg14Oxt0UzpfNv3k0qh2WJBkOIVKW90Ufx0WpEXn7vNcHqvWOYaKgqleAw1J5OsyTGy%2FfWARhQ8Q0RqRBdIpelnHmthMtW8W08lFPTGAbgpU0BI52fQSY%2BNf5kefMCitRaZm9cgsydd%2BdKYUUXwoAxhglxJF%2BKHQ6d5e7D1i9G8xdP8mDutdi%2B5cF3kWc2U0DMmE&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA4S7Z2ZFCW7QXWNOV%2F20241207%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20241207T062804Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=b2cda3bedb2e1f11121126748954758d477326dfa69fe9ceb2cb333a44c2d5f8";

export declare type AsyncState<T> =
  | {
      value: undefined;
      loading: true;
      error: undefined;
    }
  | {
      value: undefined;
      loading: false;
      error: Error;
    }
  | {
      value: T;
      loading: false;
      error: undefined;
    };

export function useInitializedDuckDB(tableName: string): AsyncState<AsyncDuckDB> {
  const { db, error: error1 } = useDuckDb();

  const { value: initialized, error: error2 } = useAsync(async () => {
    if (!db) {
      return false;
    }
    await db.open({
      query: { castBigIntToDouble: true, castDecimalToDouble: true },
    });
    const response = await fetch(DATA_CSV_FILE_PATH);
    const csvBlob = await response.blob();
    const csvFile = new File([csvBlob], "data.csv", { type: "text/csv" });
    await insertCSV(db, csvFile, tableName);
    return true;
  }, [db]);

  if (error1) {
    return { value: undefined, loading: false, error: error1 };
  }

  if (error2) {
    return { value: undefined, loading: false, error: error2 };
  }

  if (!initialized || !db) {
    return { value: undefined, loading: true, error: undefined };
  }

  return { value: db, loading: false, error: undefined };
}