import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Word {
  word: string;
  found: boolean;
}

const GRID_SIZE = 10;
const words: Word[] = [
  { word: 'LEARNING', found: false },
  { word: 'EDUCATION', found: false },
  { word: 'KNOWLEDGE', found: false },
  { word: 'STUDENT', found: false },
  { word: 'TEACHER', found: false }
];

export const WordSearch: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [remainingWords, setRemainingWords] = useState<Word[]>(words);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGrid = () => {
    const newGrid: string[][] = Array(GRID_SIZE).fill('').map(() => Array(GRID_SIZE).fill(''));
    
    // Place words in the grid
    words.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 8); // 0-7 for 8 directions
        const startRow = Math.floor(Math.random() * GRID_SIZE);
        const startCol = Math.floor(Math.random() * GRID_SIZE);
        
        if (canPlaceWord(word.word, startRow, startCol, direction, newGrid)) {
          placeWord(word.word, startRow, startCol, direction, newGrid);
          placed = true;
        }
      }
    });

    // Fill remaining spaces with random letters
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setGrid(newGrid);
  };

  const canPlaceWord = (word: string, row: number, col: number, direction: number, grid: string[][]): boolean => {
    const directions = [
      [0, 1],   // right
      [1, 1],   // down-right
      [1, 0],   // down
      [1, -1],  // down-left
      [0, -1],  // left
      [-1, -1], // up-left
      [-1, 0],  // up
      [-1, 1]   // up-right
    ];

    const [dRow, dCol] = directions[direction];
    const endRow = row + (word.length - 1) * dRow;
    const endCol = col + (word.length - 1) * dCol;

    if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const currentRow = row + i * dRow;
      const currentCol = col + i * dCol;
      if (grid[currentRow][currentCol] !== '' && grid[currentRow][currentCol] !== word[i]) {
        return false;
      }
    }

    return true;
  };

  const placeWord = (word: string, row: number, col: number, direction: number, grid: string[][]) => {
    const directions = [
      [0, 1],   // right
      [1, 1],   // down-right
      [1, 0],   // down
      [1, -1],  // down-left
      [0, -1],  // left
      [-1, -1], // up-left
      [-1, 0],  // up
      [-1, 1]   // up-right
    ];

    const [dRow, dCol] = directions[direction];
    for (let i = 0; i < word.length; i++) {
      grid[row + i * dRow][col + i * dCol] = word[i];
    }
  };

  const handleCellClick = (row: number, col: number) => {
    const newSelectedCells = [...selectedCells, [row, col] as [number, number]];
    setSelectedCells(newSelectedCells);

    if (newSelectedCells.length >= 2) {
      checkWord(newSelectedCells);
    }
  };

  const checkWord = (cells: [number, number][]) => {
    const word = cells.map(([row, col]) => grid[row][col]).join('');
    const reversedWord = word.split('').reverse().join('');

    const foundWord = remainingWords.find(w => 
      !w.found && (w.word === word || w.word === reversedWord)
    );

    if (foundWord) {
      const updatedWords = remainingWords.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      );
      setRemainingWords(updatedWords);
      setSelectedCells([]);

      if (updatedWords.every(w => w.found)) {
        setGameComplete(true);
      }
    } else {
      setTimeout(() => setSelectedCells([]), 500);
    }
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
            Word Search
          </h2>
          <p className="text-xl text-gray-400">
            Find all the hidden words in the grid!
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
          >
            <div className="grid grid-cols-10 gap-1">
              {grid.map((row, i) => (
                row.map((cell, j) => (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`w-10 h-10 flex items-center justify-center text-xl font-bold rounded-lg transition-all ${
                      selectedCells.some(([r, c]) => r === i && c === j)
                        ? 'bg-green-500/50 text-white'
                        : 'bg-gray-900/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {cell}
                  </button>
                ))
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-green-500/20"
          >
            <h3 className="text-2xl font-bold text-green-400 mb-4">Words to Find</h3>
            <div className="space-y-2">
              {remainingWords.map((word, index) => (
                <div
                  key={index}
                  className={`text-xl ${
                    word.found ? 'text-green-400 line-through' : 'text-gray-300'
                  }`}
                >
                  {word.word}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {gameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="bg-gray-800/90 rounded-xl p-8 text-center max-w-md">
                <h3 className="text-3xl font-bold text-green-400 mb-4">
                  Congratulations! 🎉
                </h3>
                <p className="text-xl text-gray-300 mb-6">
                  You found all the words!
                </p>
                <button
                  onClick={() => {
                    initializeGrid();
                    setRemainingWords(words);
                    setGameComplete(false);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xl rounded-lg transition-all transform hover:scale-105"
                >
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 