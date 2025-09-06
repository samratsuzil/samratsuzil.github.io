import React from "react";
import Tile from "./Tile";

interface Props {
  guess: string;
  isFinal: boolean;
  word: string;
}

const WORD_LENGTH = 5;

const Row: React.FC<Props> = ({ guess, isFinal, word }) => {
  const letters = Array.from({ length: WORD_LENGTH }).map(
    (_, i) => guess[i] || ""
  );

  return (
    <div className="grid grid-cols-5 gap-2">
      {letters.map((letter, i) => (
        <Tile key={i} letter={letter} index={i} isFinal={isFinal} word={word} />
      ))}
    </div>
  );
};

export default Row;
