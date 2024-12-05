import React, { useState, useEffect } from "react";
import { Table } from "apache-arrow";

import { useInitializedDuckDB } from "./useInitializedDuckDB.ts";

const App: React.FC = () => {
  const [result, setResult] = useState<any>([]);
  const [connection, setConnection] = useState<any | null>(null);
  const { value: db, loading, error } = useInitializedDuckDB("my_table");

  const [sql, setSqlText] = useState<string>("SELECT * FROM my_table where column07 = '浜松市中央区'");

  // DuckDB の接続を初期化
  useEffect(() => {
    if (db) {
      const initializeConnection = async () => {
        const connection = await db.connect();
        console.log("Connected to DuckDB:", connection);
        // setConnectionID(connection.id);
        setConnection(connection);
      };
      initializeConnection();
    }
  }, [db]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlText(e.target.value);
  }

  const runQuery = async () => {
    if (!db) {
      alert("Initialize DuckDB first!");
      return;
    }

    try {
      // Arrow フォーマットで結果を取得
      const queryResult: Table = await connection.query(sql);
      const resultJson = JSON.parse(queryResult.toString());

      console.log("query by:", sql);
      console.log(resultJson);
      setResult(resultJson);
    } catch (error) {
      console.error("Error running query:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React + DuckDB WASM Kit</h1>

      {loading && <p>Loading DuckDB...</p>}
      {error && <p>Error loading DuckDB: {error.message}</p>}

      <label>SQL</label>
      <textarea rows="5" cols="33" onChange={ handleTextareaChange }>{ sql }</textarea>

      <button onClick={runQuery}>Run SQL Query</button>

      <h2>Query Result:</h2>

      <table border="1">
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>
          {result.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((value, colIdx) => (
                <td key={colIdx}>{ value }</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
