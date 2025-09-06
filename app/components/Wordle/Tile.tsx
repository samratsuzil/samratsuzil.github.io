import React from "react";
import { motion } from "framer-motion";

interface Props {
  letter: string;
  index: number;
  isFinal: boolean;
  word: string;
}

function getStatus(letter: string, index: number, word: string) {
  if (!letter) return "empty";
  if (word[index] === letter) return "correct";
  if (word.includes(letter)) return "present";
  return "absent";
}

function getClass(status: string) {
  if (status === "correct") return "bg-green-500 text-white border-none";
  if (status === "present") return "bg-yellow-400 text-white border-none";
  if (status === "absent") return "bg-gray-400 text-white border-none";
  return "bg-gray-200 border";
}

const Tile: React.FC<Props> = ({ letter, index, isFinal, word }) => {
  const status = isFinal ? getStatus(letter, index, word) : "empty";

  return (
    <motion.div
      initial={false}
      animate={{
        rotateX: isFinal ? [0, 90, 0] : 0,
      }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`w-16 h-16 flex items-center justify-center rounded font-bold text-xl uppercase border ${getClass(
        status
      )}`}
    >
      {letter}
    </motion.div>
  );
};

export default Tile;
