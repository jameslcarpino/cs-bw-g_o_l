import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonToggle,
  Card,
  Row,
  Col,
} from "reactstrap";
import styled from "styled-components";
import Info from "./Info";

//------STYLED COMPONENTS-------//
const Background = styled.div`
  background-color: gray;
  padding: 1%;
`;

const ControlsCard = styled.div`
  display: flex;
  width: 57%;
  justify-content: space-evenly;
  alrign-items: flex-start;
  margin-left: 23%;
`;

const GameSpeedCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding-top: 1%;
`;
const SpeedTitles = styled.h5`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

const ColorControlCard = styled.div`
  display: flex;

  justify-content: space-evenly;

  flex-wrap: wrap;
  padding-top: 1%;
`;

const GameBoardCard = styled.div`
  margin-left: 2%;
`;
const GameBoard = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  margin-left: 40%;
`;
//-----------------------------//
const numRows = 25;
const numCols = 25;

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
  const [cellColor, setCellColor] = useState(color);

  const [dropdownOpen, setOpen] = useState(false);
  const toggleDropColor = () => setOpen(!dropdownOpen);

  const [population, setPopulation] = useState(0);

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

  const popRef = useRef(population);
  popRef.current = population;

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

    setGeneration((gens) => {
      return (gens = gens + 1);
    });

    //simulation
    //double forloop that goes through every value in grid
    setGrid((value) => {
      //produce allows the state to be held at the point it was made keeping the original state in tact but also holds the previous state(or state that is added too)
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
      <Background>
        <Row>
          <Col sm="6">
            <Card
              body
              inverse
              style={{ backgroundColor: "#333", borderColor: "#333" }}
            >
              <ControlsCard classname="controls">
                <ButtonToggle
                  color="success"
                  outline
                  size="sm"
                  onClick={() => {
                    setWorking(!working);
                    if (!working) {
                      workingRef.current = true;
                      runGOL();
                    }
                  }}
                >
                  {working ? "Stop Life" : "Give Life"}
                </ButtonToggle>
                <ButtonToggle
                  color="warning"
                  outline
                  size="sm"
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
                </ButtonToggle>
                <ButtonToggle
                  color="primary"
                  outline
                  size="sm"
                  id="randomButton"
                  disabled={
                    working
                      ? (document.getElementById(
                          "randomButton"
                        ).disabled = true)
                      : false
                  }
                  onClick={() => {
                    const rows = [];
                    for (let i = 0; i < numRows; i++) {
                      rows.push(
                        Array.from(Array(numCols), () =>
                          Math.random() > 0.75 ? 1 : 0
                        )
                      );
                    }
                    setGrid(rows);
                    setGeneration(0);
                  }}
                >
                  Chaos Generator
                </ButtonToggle>
              </ControlsCard>

              <ColorControlCard>
                {/* <ColorTitle>Choose Life's Color:</ColorTitle> */}
                <ButtonDropdown
                  color="warning"
                  isOpen={dropdownOpen}
                  toggle={toggleDropColor}
                >
                  <DropdownToggle caret size="sm" outline color="info" block>
                    Choose Life's Color
                  </DropdownToggle>
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
              </ColorControlCard>
              <SpeedTitles>Generations: {generation}</SpeedTitles>
              <GameBoardCard
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${numCols}, 20px)`,
                }}
              >
                {grid.map((rows, index) =>
                  rows.map((col, colIdx) => (
                    <GameBoard
                      key={`${index}-${colIdx}}`}
                      onClick={() => {
                        //this stops the board from being clickable when its running.
                        if (!working) {
                          const newGrid = produce(grid, (gridCopy) => {
                            gridCopy[index][colIdx] = grid[index][colIdx]
                              ? 0
                              : 1;
                          });
                          setGrid(newGrid);
                        }
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: grid[index][colIdx]
                          ? `${cellColor}`
                          : "gray",
                        border: `solid 1px #333`,
                      }}
                    />
                  ))
                )}
              </GameBoardCard>

              <GameSpeedCard class="speedOptions">
                <SpeedTitles>Speed Controls:</SpeedTitles>
                <br />

                <Button
                  outline
                  color="danger"
                  size="sm"
                  onClick={() => {
                    setFreq(30);
                  }}
                >
                  Fast
                </Button>

                <Button
                  outline
                  color="primary"
                  size="sm"
                  onClick={() => {
                    setFreq(freq);
                  }}
                >
                  Normal
                </Button>
                <Button
                  outline
                  color="warning"
                  size="sm"
                  onClick={() => {
                    setFreq(2000);
                  }}
                >
                  Slow
                </Button>
                <br />
                {/* <SpeedTitles>Speed up life by 1/2 second</SpeedTitles> */}
                <Button
                  outline
                  color="info"
                  size="sm"
                  onClick={() => {
                    setFreq(freq - 50);
                  }}
                >
                  Increase Speed
                </Button>
                {/* <h5>Slow down life by 1/2 second</h5> */}
                <Button
                  outline
                  color="info"
                  size="sm"
                  onClick={() => {
                    setFreq(freq + 50);
                  }}
                >
                  Decrease Speed
                </Button>
              </GameSpeedCard>
            </Card>
          </Col>
          <Col sm="6">
            <Card body>
              <Info />
            </Card>
          </Col>
        </Row>
      </Background>
    </>
  );
};
export default Grid;
