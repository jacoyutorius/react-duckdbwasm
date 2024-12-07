import React, { useState, useEffect } from "react";
import { Table } from "apache-arrow";

import { useInitializedDuckDB } from "./useInitializedDuckDB.ts";

const App: React.FC = () => {
  const [result, setResult] = useState<any>([]);
  const [connection, setConnection] = useState<any | null>(null);
  const { value: db, loading, error } = useInitializedDuckDB("ken_all");

  const [sql, setSqlText] = useState<string>("SELECT * FROM ken_all where column07 = '浜松市中央区'");

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
      <h1>React + DuckDB wasm kit</h1>

      {loading && <p>Loading DuckDB...</p>}
      {error && <p>Error loading DuckDB: {error.message}</p>}

      <label>SQL</label>
      <textarea onChange={ handleTextareaChange }>{ sql }</textarea>

      <button onClick={runQuery}>Run SQL Query</button>

      <h2>Query Result:</h2>

      <table>
        <thead>
          <tr>
            <td>column00</td>
            <td>column01</td>
            <td>column02</td>
            <td>column03</td>
            <td>column04</td>
            <td>column05</td>
            <td>column06</td>
            <td>column07</td>
            <td>column08</td>
            <td>column09</td>
            <td>column10</td>
            <td>column11</td>
            <td>column12</td>
            <td>column13</td>
            <td>column14</td>
          </tr>
        </thead>
        <tbody>
          {result.map((row: any, idx: number) => (
            <tr key={idx}>
              {Object.values(row).map((value: any, colIdx: any) => (
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
