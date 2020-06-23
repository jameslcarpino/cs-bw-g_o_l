import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 10;
const numCols = 10;

const neighbors = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const Grid = (props) => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });
  //console.log(grid);
  const [working, setWorking] = useState(false);
  const [generation, setGeneration] = useState(0);
  //stores the reference of the working state
  const workingRef = useRef(working);
  workingRef.current = working;

  const gens = useRef(generation);
  gens.current = generation;
  const runGOL = useCallback(() => {
    if (!workingRef.current) {
      return;
    }

    setGeneration((gens) => {
      return (gens = gens + 1);
    });

    //simulation
    //double forloop that goes through every value in grid
    setGrid((value) => {
      return produce(value, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbor = 0;
            neighbors.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              //checking bounds of the grid
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbor += value[newI][newJ];
              }
            });
            //game logic for the rules of life
            if (neighbor < 2 || neighbor > 3) {
              gridCopy[i][j] = 0;
            } else if (value[i][j] === 0 && neighbor === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runGOL, 1000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setWorking(!working);
          if (!working) {
            workingRef.current = true;
            runGOL();
          }
        }}
      >
        {working ? "Stop Life" : "Give Life"}
      </button>
      <h2>Generations: {generation}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, index) =>
          rows.map((col, colIdx) => (
            <div
              key={`${index}-${colIdx}}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[index][colIdx] = grid[index][colIdx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[index][colIdx] ? "blue" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};
export default Grid;
