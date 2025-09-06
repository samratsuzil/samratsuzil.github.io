import React from "react";

const keyboardLayout = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  ["Enter", ..."ZXCVBNM".split(""), "⌫"],
];

interface Props {
  keyStatuses: Record<string, string>;
  onKeyPress: (key: string) => void;
}

function getKeyClass(status?: string) {
  if (status === "correct") return "bg-green-500 text-white";
  if (status === "present") return "bg-yellow-400 text-white";
  if (status === "absent") return "bg-gray-400 text-white";
  return "bg-gray-300";
}

const Keyboard: React.FC<Props> = ({ keyStatuses, onKeyPress }) => {
  return (
    <div className="mt-8 space-y-2">
      {keyboardLayout.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`px-5 py-5 rounded font-bold uppercase hover:opacity-80 active:scale-95 transition ${getKeyClass(
                keyStatuses[key]
              )}`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
