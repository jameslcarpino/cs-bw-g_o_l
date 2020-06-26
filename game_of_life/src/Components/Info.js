import React from "react";
import styled from "styled-components";

//-------STYLED----//
const Title = styled.h3`
  font-size: 1rem;
  text-align: center;
  color: #333;
  text-decoration: underline;
`;
const Border = styled.div`
  border: 1px black dotted;
  padding: 5%;
`;
const Text = styled.p`
  text-align: center;
`;

const Link = styled.a`
  text-align: center;
`;
//-----------------//

const Info = (props) => {
  return (
    <>
      <Border>
        <div>
          <Title>WHAT IS CONWAY'S GAME OF LIFE?</Title>
          <Text>
            The Game of Life, also known simply as Life, is a cellular automaton
            devised by the British mathematician John Horton Conway in 1970. It
            is a zero-player game, meaning that its evolution is determined by
            its initial state, requiring no further input.{" "}
          </Text>
          <br />
          <Text>
            Simply put, it is a computer generated simulation of the interaction
            of cells and their neighbors causing them to become "alive" or
            "dead".
            <br />
            <Link
              target="_blank"
              href="https://en.wikipedia.org/wiki/Conway's_Game_of_Life"
            >
              Conway's Game of Life Wikipedia
            </Link>
          </Text>
          <br />
        </div>
        <div>
          <Title>RULES OF THE GAME:</Title>
          <Text>
            1. Any live cell with two or three live neighbours survives.
          </Text>
          <br />
          <Text>
            2. Any dead cell with three live neighbours becomes a live cell.
          </Text>
          <br />
          <Text>
            3. All other live cells die in the next generation. Similarly, all
            other dead cells stay dead.
          </Text>
        </div>
        <div>
          <Title>HOW TO USE THIS SIMULATION:</Title>
          <Text>
            Generate a new game by clicking any number of squares, or 'Chaos
            Generator', to populate the board. Then hit "Give Life" to watch the
            simulation play out. You can speed up, slow down, or change the
            color of the cells by clicking on their respective buttons.
          </Text>
        </div>
      </Border>
    </>
  );
};

export default Info;
