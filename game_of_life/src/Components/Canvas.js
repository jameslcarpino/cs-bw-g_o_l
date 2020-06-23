import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  //creating the grid itself
  useEffect(() => {
    const canvas = document.getElementById("canvasID");
    const ctx = canvas.getContext("2d");

    const resolution = 40;
    canvas.width = 400;
    canvas.height = 400;

    const cols = canvas.width / resolution;
    const rows = canvas.height / resolution;

    function buildGrid() {
      const grid = new Array(cols)
        .fill(null)
        .map(() => new Array(rows).fill(0));
      return grid;
    }
    const grid = buildGrid();

    function render(grid) {
      for (let cols = 0; cols < grid.length; cols++) {
        for (let rows = 0; rows < grid[cols].length; rows++) {
          const cell = grid[cols][rows];

          ctx.beginPath();
          ctx.rect(
            cols * resolution,
            rows * resolution,
            resolution,
            resolution
          );
          ctx.stroke();
        }
      }
    }
    render(grid);
  });

  return (
    <div>
      <canvas id="canvasID" />
    </div>
  );
};
export default Canvas;
