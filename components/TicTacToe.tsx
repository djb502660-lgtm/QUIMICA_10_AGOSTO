import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trophy, Skull, Minus } from 'lucide-react';
import { Assistant } from '../types';

interface TicTacToeProps {
  theme: Assistant['theme'];
  onGameEnd: (result: 'user' | 'assistant' | 'draw') => void;
  isActive: boolean;
}

type Player = 'X' | 'O' | null;

export const TicTacToe: React.FC<TicTacToeProps> = ({ theme, onGameEnd, isActive }) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isUserNext, setIsUserNext] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'user_won' | 'assistant_won' | 'draw'>('playing');

  // Theme styles
  const styles = {
    cyan: {
      x: 'text-cyan-400',
      o: 'text-blue-500',
      board: 'border-cyan-500/30 bg-slate-900/50',
      button: 'bg-cyan-600 hover:bg-cyan-500',
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]'
    },
    rose: {
      x: 'text-rose-400',
      o: 'text-pink-500',
      board: 'border-rose-500/30 bg-slate-900/50',
      button: 'bg-rose-600 hover:bg-rose-500',
      glow: 'shadow-[0_0_15px_rgba(244,114,182,0.3)]'
    },
    amber: {
      x: 'text-amber-400',
      o: 'text-orange-500',
      board: 'border-amber-500/30 bg-slate-900/50',
      button: 'bg-amber-600 hover:bg-amber-500',
      glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'
    },
    violet: {
      x: 'text-violet-400',
      o: 'text-purple-500',
      board: 'border-violet-500/30 bg-slate-900/50',
      button: 'bg-violet-600 hover:bg-violet-500',
      glow: 'shadow-[0_0_15px_rgba(167,139,250,0.3)]'
    }
  };

  const currentStyle = styles[theme];

  const checkWinner = useCallback((squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }, []);

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsUserNext(true);
    setGameStatus('playing');
  };

  // AI Logic
  useEffect(() => {
    if (!isUserNext && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        
        if (availableMoves.length === 0) return;

        // Simple AI: 1. Try to win, 2. Block user, 3. Random
        let move = -1;

        // Helper to simulate move
        const canWin = (player: Player) => {
          for (let i of availableMoves) {
            const tempBoard = [...board];
            tempBoard[i] = player;
            if (checkWinner(tempBoard) === player) return i;
          }
          return -1;
        };

        const winningMove = canWin('O');
        const blockingMove = canWin('X');

        if (winningMove !== -1) move = winningMove;
        else if (blockingMove !== -1) move = blockingMove;
        else move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setIsUserNext(true);
      }, 600); // Delay for realism

      return () => clearTimeout(timer);
    }
  }, [isUserNext, gameStatus, board, checkWinner]);

  // Check Game State changes
  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      if (winner === 'X') {
        setGameStatus('user_won');
        if (isActive) onGameEnd('user');
      } else {
        setGameStatus('assistant_won');
        if (isActive) onGameEnd('assistant');
      }
    } else if (!board.includes(null)) {
      setGameStatus('draw');
      if (isActive) onGameEnd('draw');
    }
  }, [board, checkWinner, isActive]); // Removed onGameEnd from dependency to avoid loop if parent recreates it

  const handleClick = (index: number) => {
    if (board[index] || !isUserNext || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsUserNext(false);
  };

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 ${currentStyle.board} ${isActive ? currentStyle.glow : ''}`}>
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="text-white font-bold tracking-wider text-sm uppercase">Tres en Raya</h3>
        <button 
          onClick={handleReset}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Reiniciar juego"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={cell !== null || !isUserNext || gameStatus !== 'playing'}
            className={`
              w-16 h-16 rounded-lg text-3xl font-bold flex items-center justify-center transition-all duration-200
              ${cell === null ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-800 shadow-inner'}
              ${cell === 'X' ? currentStyle.x : currentStyle.o}
              ${!isUserNext && !cell ? 'cursor-wait opacity-50' : ''}
            `}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="h-8 flex items-center justify-center">
        {gameStatus === 'playing' ? (
          <span className="text-xs text-slate-400 animate-pulse">
            {isUserNext ? 'Tu turno (X)' : 'Pensando...'}
          </span>
        ) : (
          <div className="flex items-center gap-2 font-bold animate-in zoom-in duration-300">
            {gameStatus === 'user_won' && (
              <><Trophy className="w-4 h-4 text-yellow-400" /><span className="text-yellow-400">¡Ganaste!</span></>
            )}
            {gameStatus === 'assistant_won' && (
              <><Skull className="w-4 h-4 text-slate-400" /><span className="text-slate-400">Perdiste...</span></>
            )}
            {gameStatus === 'draw' && (
              <><Minus className="w-4 h-4 text-white" /><span className="text-white">Empate</span></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
