import React, { useRef, useEffect } from "react";
let numRows = 25;
let numCols = 25;

const Canvas = (props) => {
  useEffect(() => {
    let canvas = document.getElementById("canvasID");
    let ctx = canvas.getContext("2d");
  });

  return (
    <div>
      <canvas
        id="canvasID"
        width={200}
        height={200}
        style={{ backgroundColor: "blue" }}
      />
    </div>
  );
};
export default Canvas;
