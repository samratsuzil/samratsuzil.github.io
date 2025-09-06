import React from "react";
import Row from "./Row";

interface Props {
  guesses: string[];
  currentGuess: string;
  word: string;
  maxTries: number;
}

const Board: React.FC<Props> = ({ guesses, currentGuess, word, maxTries }) => {
  return (
    <div className="grid grid-rows-6 gap-2">
      {Array.from({ length: maxTries }).map((_, rowIdx) => {
        const guess =
          guesses[rowIdx] || (rowIdx === guesses.length ? currentGuess : "");
        return (
          <Row
            key={rowIdx}
            guess={guess}
            isFinal={rowIdx < guesses.length}
            word={word}
          />
        );
      })}
    </div>
  );
};

export default Board;
