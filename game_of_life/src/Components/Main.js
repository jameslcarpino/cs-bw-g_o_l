import React, { useState, useEffect } from "react";
import Grid from "./Grid";

const Main = (props) => {
  // const [grid, setGrid] = useState();
  const [generations, setGenerations] = useState(0);

  return (
    <div>
      <h1>Conway's Game of Life</h1>
      <Grid />
      <h2>Life generations: {generations}</h2>
    </div>
  );
};

export default Main;
