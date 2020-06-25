import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Canvas from "./Canvas";
import Info from "./Info";

const newGame = {
  gridSize: 25,
  cellSize: 15,
  cellLife: Array(25 * 25),
};

const Main = (props) => {
  const [grid, setGrid] = useState(newGame);
  const [generations, setGenerations] = useState(0);
  const [isWorking, setIsWorking] = useState(false);

  return (
    <div>
      <h1>Conway's Game of Life</h1>

      {/* <Canvas grid={grid} /> */}
      <div>
        <Grid generations={generations} />
      </div>
      <div>
        <Info />
      </div>
      {/* <h2>Life generations: {generations}</h2> */}
    </div>
  );
};

export default Main;
