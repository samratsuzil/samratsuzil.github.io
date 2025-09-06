import React, { useState, useEffect } from "react";
import Board from "./Board";
import Keyboard from "./Keyboard";

const WORD_LENGTH = 5;
const MAX_TRIES = 6;

type Status = "correct" | "present" | "absent";

function getBetterStatus(current: Status | undefined, next: Status): Status {
  const rank: Record<Status, number> = {
    correct: 3,
    present: 2,
    absent: 1,
  };

  if (!current) return next;
  return rank[next] > rank[current] ? next : current;
}

const Wordle: React.FC = () => {
  const [word, setWord] = useState<string>("REACT"); // default until API loads
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [keyStatuses, setKeyStatuses] = useState<Record<string, string>>({});

  // 🔹 Validate word using dictionary API
  async function validateWord(word: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
      );
      return res.ok; // ✅ valid if API returns 200
    } catch {
      return false;
    }
  }

  // 🔹 Fetch random word from API
  useEffect(() => {
    async function fetchWord() {
      try {
        const res = await fetch(
          "https://random-word-api.herokuapp.com/word?length=5"
        );
        const data = await res.json();
        setWord(data[0].toUpperCase());
      } catch (err) {
        console.error("Failed to fetch word, using fallback REACT", err);
      }
    }
    fetchWord();
  }, []);

  // 🔹 Physical keyboard support
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isGameOver) return;

      if (e.key === "Enter") handleKeyPress("Enter");
      else if (e.key === "Backspace") handleKeyPress("⌫");
      else {
        const letter = e.key.toUpperCase();
        if (/^[A-Z]$/.test(letter)) handleKeyPress(letter);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, guesses, isGameOver]);

  async function handleKeyPress(key: string) {
    if (isGameOver) return;

    if (key === "Enter") {
      if (currentGuess.length !== WORD_LENGTH) return;

      if (guesses.length >= MAX_TRIES) {
        setMessage("No more tries!");
        setIsGameOver(true);
        return;
      }

      // ✅ validate with dictionary API
      const isValid = await validateWord(currentGuess);
      if (!isValid) {
        setMessage("Not a valid word!");
        return;
      }

      // 🔹 Clear previous message after a valid guess
      setMessage("");

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      updateKeyStatuses(currentGuess);
      setCurrentGuess("");

      if (currentGuess === word) {
        setMessage("🎉 You guessed it!");
        setIsGameOver(true);
      } else if (newGuesses.length === MAX_TRIES) {
        setMessage(`Game over! The word was ${word}`);
        setIsGameOver(true);
      }
    } else if (key === "⌫") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  }

  function updateKeyStatuses(guess: string) {
    const newStatuses = { ...keyStatuses };

    guess.split("").forEach((letter, i) => {
      if (word[i] === letter) {
        newStatuses[letter] = getBetterStatus(
          newStatuses[letter] as Status,
          "correct"
        );
      } else if (word.includes(letter)) {
        newStatuses[letter] = getBetterStatus(
          newStatuses[letter] as Status,
          "present"
        );
      } else {
        newStatuses[letter] = getBetterStatus(
          newStatuses[letter] as Status,
          "absent"
        );
      }
    });

    setKeyStatuses(newStatuses);
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        word={word}
        maxTries={MAX_TRIES}
      />

      <Keyboard keyStatuses={keyStatuses} onKeyPress={handleKeyPress} />

      {message && <p className="mt-6 text-lg font-semibold">{message}</p>}
    </div>
  );
};

export default Wordle;
