import { type AsyncDuckDB, insertCSV, useDuckDb } from "duckdb-wasm-kit";
import { useAsync } from "react-use";

const DATA_CSV_FILE_PATH = "http://localhost:5173/src/utf_ken_all.csv";

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