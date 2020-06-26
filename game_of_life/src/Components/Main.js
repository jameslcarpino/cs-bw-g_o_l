import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Canvas from "./Canvas";
import Info from "./Info";
import styled from "styled-components";

//this is for the canvas route that I worked on
// const newGame = {
//   gridSize: 25,
//   cellSize: 15,
//   cellLife: Array(25 * 25),
// };

//------//
//styled componenets
const Header = styled.h1`
  font-family: "Anton", sans-serif;
  font-size: 4.5rem;
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  width: 100%;
  backround-color: #333;
  margin-bottom: 0%;
  padding: 1%;

  color: black;
  text-shadow: 1.5px 1px silver;
`;

//------//
const Main = (props) => {
  return (
    <div>
      <div style={{ backgroundColor: "gray" }}>
        <Header>CONWAY'S GAME OF LIFE</Header>
      </div>
      {/* <Canvas grid={grid} /> */}
      <div>
        <Grid />
      </div>

      {/* <h2>Life generations: {generations}</h2> */}
    </div>
  );
};

export default Main;
