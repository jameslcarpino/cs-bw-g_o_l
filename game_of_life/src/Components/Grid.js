import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 15;
const numCols = 15;

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
const makeEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const Grid = (props) => {
  //state lives here
  const [grid, setGrid] = useState(() => {
    return makeEmptyGrid();
  });
  //console.log(grid);
  const [working, setWorking] = useState(false);
  const [generation, setGeneration] = useState(0);

  const [freq, setFreq] = useState(1000);
  //state above
  //stores the reference of the working state
  const workingRef = useRef(working);
  workingRef.current = working;
  //stores the state of the generations state
  const gens = useRef(generation);
  gens.current = generation;

  const changeSpeed = (event) => {
    const speed = event.target.value;
    setFreq(speed);
  };

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

    setTimeout(runGOL, changeSpeed(freq));
    // const oneSec = setTimeout(runGOL, 1000);
    // const twoSec = setTimeout(runGOL, 2000);
    // const halfSec = setTimeout(runGOL, 500);
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
      <button
        id="resetButton"
        disabled={
          working
            ? (document.getElementById("resetButton").disabled = true)
            : false
        }
        onClick={() => {
          setGrid(makeEmptyGrid());
          setGeneration(0);
        }}
      >
        Reset Life
      </button>
      <button
        id="randomButton"
        disabled={
          working
            ? (document.getElementById("randomButton").disabled = true)
            : false
        }
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.75 ? 1 : 0))
            );
          }
          setGrid(rows);
          setGeneration(0);
        }}
      >
        Chaos Generator
      </button>
      <label>Speed of Life</label>
      <select onChange={changeSpeed}>
        <option value="1000">1 second</option>
        <option value=".5">1/2 second</option>
        <option value="5000">2 seconds</option>
      </select>
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
                //this stops the board from being clickable when its running.
                if (!working) {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[index][colIdx] = grid[index][colIdx] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }
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
