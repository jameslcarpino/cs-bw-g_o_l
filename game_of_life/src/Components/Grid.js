import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const numRows = 25;
const numCols = 45;

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

//allows the edges to wrap using a modulous and then shifting the x y index value to beginning or end depending.
const countNeighbors = (grid, x, y) => {
  return neighbors.reduce((acc, [i, j]) => {
    const newI = (i + x + numRows) % numRows;
    const newJ = (j + y + numCols) % numCols;
    acc += grid[newI][newJ];
    return acc;
    //checking bounds of the grid
  }, 0);
};

const lifeGenCount = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    let result = grid[i].find((elem) => elem === 1);
    if (result === 1) {
      return result;
    }
  }
};

const Grid = (props) => {
  var randomColor = require("randomcolor");
  var color = randomColor();
  //state lives here
  const [grid, setGrid] = useState(() => {
    return makeEmptyGrid();
  });
  //console.log(grid);
  const [working, setWorking] = useState(false);
  const [generation, setGeneration] = useState(0);

  const [freq, setFreq] = useState(1000);
  const [cellColor, setCellColor] = useState("black");

  const [dropdownOpen, setOpen] = useState(false);
  const toggleDropColor = () => setOpen(!dropdownOpen);

  //state above
  //refs
  //stores the reference of the working state
  const workingRef = useRef(working);
  workingRef.current = working;

  //check if the grid is running
  const gridRef = useRef(grid);
  gridRef.current = grid;
  //stores the state of the generations state
  const gens = useRef(generation);
  gens.current = generation;
  //refspeed
  const freqRef = useRef(freq);
  freqRef.current = freq;

  const runGOL = useCallback(() => {
    if (!workingRef.current) {
      return;
    }
    //checks grids current ref if here is any life
    let lifeCycle = lifeGenCount(gridRef.current);
    if (lifeCycle === undefined) {
      setWorking(false);
      return;
    }

    setGeneration((gens, value) => {
      if (setGrid) {
        return (gens = gens + 1);
      } else {
        return (gens = gens);
      }
    });

    //simulation
    //double forloop that goes through every value in grid
    setGrid((value) => {
      return produce(value, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbor = countNeighbors(value, i, j);

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

    setTimeout(runGOL, freqRef.current);
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
      <div>
        <h3>Game Speed Presets:</h3>

        <button
          onClick={() => {
            setFreq(500);
          }}
        >
          1/2 Second
        </button>
        <button
          onClick={() => {
            setFreq(freq);
          }}
        >
          1 Second
        </button>
        <button
          onClick={() => {
            setFreq(2000);
          }}
        >
          2 Seconds
        </button>
        <h4>Speed up life by 1/2 second</h4>
        <button
          onClick={() => {
            setFreq(freq - 500);
          }}
        >
          -
        </button>
        <h4>Slow down life by 1/2 second</h4>
        <button
          onClick={() => {
            setFreq(freq + 500);
          }}
        >
          +
        </button>
      </div>
      <div>
        <h5>Choose a color:</h5>
        <ButtonDropdown
          color="warning"
          isOpen={dropdownOpen}
          toggle={toggleDropColor}
        >
          <DropdownToggle caret>colors</DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() => {
                setCellColor("blue");
              }}
            >
              Blue
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setCellColor("yellow");
              }}
            >
              Yellow
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setCellColor("green");
              }}
            >
              Green
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setCellColor("orange");
              }}
            >
              Orange
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setCellColor(color);
              }}
            >
              Random
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
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
                backgroundColor: grid[index][colIdx]
                  ? `${cellColor}`
                  : undefined,
                border: `solid 1px black`,
              }}
            />
          ))
        )}
      </div>
    </>
  );
};
export default Grid;
