import { useState } from "react";
import type { NextPage } from "next";

import Node from "../components/Node";
import styles from "../styles/Home.module.css";

const numRows = 24;
const numCols = 50;

const generateEmptyGrid = () => {
  const rows = [];
  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    const cols = [];
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const node = {
        rowIdx,
        colIdx,
        isStart: rowIdx === 10 && colIdx === 10,
        isFinish: rowIdx === 10 && colIdx === 30,
      };
      cols.push(node);
    }
    rows.push(cols);
  }
  return rows;
};

const Home: NextPage = () => {
  const [nodes, setNodes] = useState(generateEmptyGrid);

  return (
    <div className={styles.container}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {nodes.map((rows) => {
          return rows.map((row, rowIdx) => <Node key={rowIdx} {...row} />);
        })}
      </div>
    </div>
  );
};

export default Home;
