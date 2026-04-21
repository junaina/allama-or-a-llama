import { useEffect, useMemo, useState, useRef } from "react";
import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import allamaSprite from "../assets/allama.png";
import llamaSprite from "../assets/llama.png";
type GuessType = "allama" | "llama";

type CsvRow = {
  id: string;
  content: string;
  type: GuessType;
};
type GamePageProps = {
  onBackToHome: () => void;
};
const GAME_TIME_SECONDS = 60;
const ANSWER_DELAY_MS = 900;

function shuffleArray(items: CsvRow[]): CsvRow[] {
  const shuffled: CsvRow[] = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }

  return shuffled;
}

export default function GamePage({ onBackToHome }: GamePageProps) {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedGuess, setSelectedGuess] = useState<GuessType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(GAME_TIME_SECONDS);
  const [gameStopped, setGameStopped] = useState<boolean>(false);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameOverAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameOverPlayedRef = useRef<boolean>(false);
  const gameOverHomeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isGameOver: boolean =
    gameStopped || timeLeft === 0 || currentIndex >= rows.length;

  useEffect(() => {
    const correctAudio = new Audio("/sounds/correct.mp3");
    correctAudio.volume = 0.45;
    correctAudio.preload = "auto";
    correctAudio.load();

    const incorrectAudio = new Audio("/sounds/incorrect.mp3");
    incorrectAudio.volume = 0.45;
    incorrectAudio.preload = "auto";
    incorrectAudio.load();

    const gameOverAudio = new Audio("/sounds/game-over.mp3");
    gameOverAudio.volume = 0.5;
    gameOverAudio.preload = "auto";
    const gameOverHomeAudio = new Audio("/sounds/home-screen.mp3");
    gameOverHomeAudio.volume = 0.25;
    gameOverHomeAudio.loop = true;
    gameOverHomeAudio.preload = "auto";
    gameOverHomeAudio.load();

    correctAudioRef.current = correctAudio;
    incorrectAudioRef.current = incorrectAudio;
    gameOverAudioRef.current = gameOverAudio;
    gameOverHomeAudioRef.current = gameOverHomeAudio;

    return () => {
      gameOverAudio.onended = null;

      correctAudio.pause();
      incorrectAudio.pause();
      gameOverAudio.pause();
      gameOverHomeAudio.pause();

      correctAudioRef.current = null;
      incorrectAudioRef.current = null;
      gameOverAudioRef.current = null;
      gameOverHomeAudioRef.current = null;
    };
  }, []);
  function stopAudio(audio: HTMLAudioElement | null): void {
    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }
  function playAudio(audio: HTMLAudioElement | null): void {
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // ignore blocked playback
    });
  }

  useEffect(() => {
    const gameOverAudio = gameOverAudioRef.current;
    const gameOverHomeAudio = gameOverHomeAudioRef.current;

    if (!isGameOver) {
      gameOverPlayedRef.current = false;

      if (gameOverAudio) {
        gameOverAudio.onended = null;
      }

      stopAudio(gameOverAudio);
      stopAudio(gameOverHomeAudio);
      return;
    }

    if (!gameOverAudio || !gameOverHomeAudio || gameOverPlayedRef.current) {
      return;
    }

    gameOverPlayedRef.current = true;

    stopAudio(gameOverHomeAudio);

    gameOverAudio.onended = () => {
      gameOverAudio.onended = null;
      gameOverHomeAudio.currentTime = 0;

      void gameOverHomeAudio.play().catch((error: unknown) => {
        console.error("Failed to play game-over home music", error);
      });
    };

    playAudio(gameOverAudio);
  }, [isGameOver]);

  useEffect(() => {
    async function loadCsv(): Promise<void> {
      try {
        const response = await fetch("/allamaorallama240.csv");

        if (!response.ok) {
          setErrorMessage("Could not load the CSV file.");
          setLoading(false);
          return;
        }

        const csvText = await response.text();

        Papa.parse<CsvRow>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<CsvRow>) => {
            if (results.errors.length > 0) {
              setErrorMessage("Could not parse the CSV file.");
              setLoading(false);
              return;
            }

            const cleanedRows: CsvRow[] = results.data
              .filter((row: CsvRow) => {
                return (
                  typeof row.id === "string" &&
                  typeof row.content === "string" &&
                  (row.type === "allama" || row.type === "llama")
                );
              })
              .map((row: CsvRow) => ({
                id: row.id.trim(),
                content: row.content.trim(),
                type: row.type,
              }));

            setRows(shuffleArray(cleanedRows));
            setLoading(false);
          },
          error: (error: Error) => {
            setErrorMessage(error.message || "Could not parse the CSV file.");
            setLoading(false);
          },
        });
      } catch {
        setErrorMessage("Could not load the CSV file.");
        setLoading(false);
      }
    }

    void loadCsv();
  }, []);

  const currentRow: CsvRow | undefined = rows[currentIndex];

  const verses: string[] = useMemo(() => {
    if (!currentRow) {
      return [];
    }

    return currentRow.content
      .split("/")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);
  }, [currentRow]);

  useEffect(() => {
    if (loading || errorMessage || rows.length === 0 || isGameOver) {
      return;
    }

    const timerId: number = window.setTimeout(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [loading, errorMessage, rows.length, isGameOver, timeLeft]);

  useEffect(() => {
    if (!showResult || isGameOver) {
      return;
    }

    const resultTimerId: number = window.setTimeout(() => {
      setSelectedGuess(null);
      setShowResult(false);
      setCurrentIndex((prevIndex: number) => prevIndex + 1);
    }, ANSWER_DELAY_MS);

    return () => {
      window.clearTimeout(resultTimerId);
    };
  }, [showResult, isGameOver]);

  function playResultSound(isAnswerCorrect: boolean): void {
    if (isAnswerCorrect) {
      playAudio(correctAudioRef.current);
      return;
    }

    playAudio(incorrectAudioRef.current);
  }
  function handleGuess(guess: GuessType): void {
    if (!currentRow || showResult || isGameOver) {
      return;
    }

    const isAnswerCorrect = guess === currentRow.type;

    setSelectedGuess(guess);
    setShowResult(true);

    if (isAnswerCorrect) {
      setScore((prevScore: number) => prevScore + 1);
    } else {
      setWrongAnswers((prevWrongAnswers: number) => prevWrongAnswers + 1);
    }

    playResultSound(isAnswerCorrect);
  }

  function handleStopPlaying(): void {
    setGameStopped(true);
  }
  function handleReplay(): void {
    if (gameOverAudioRef.current) {
      gameOverAudioRef.current.onended = null;
    }

    stopAudio(gameOverAudioRef.current);
    stopAudio(gameOverHomeAudioRef.current);

    setRows((prevRows: CsvRow[]) => shuffleArray(prevRows));
    setCurrentIndex(0);
    setSelectedGuess(null);
    setScore(0);
    setWrongAnswers(0);
    setShowResult(false);
    setTimeLeft(GAME_TIME_SECONDS);
    setGameStopped(false);
    setErrorMessage("");
    gameOverPlayedRef.current = false;
  }
  if (loading) {
    return <div className="page">Loading game...</div>;
  }

  if (errorMessage) {
    return <div className="page">{errorMessage}</div>;
  }

  if (rows.length === 0) {
    return <div className="page">No game data found.</div>;
  }
  function getPerformanceLabel(correct: number, wrong: number): string {
    if (correct == 0 && wrong == 0) {
      return "Didn't even try, what a loser";
    }
    if (correct > wrong) {
      return "You seem to know Allama quite well";
    }

    if (correct < wrong) {
      return "Haha Loser";
    }

    return "Meh mediocre";
  }
  const performanceLabel: string = getPerformanceLabel(score, wrongAnswers);
  if (isGameOver) {
    return (
      <div className="page game-page">
        <div className="game-card game-over-card">
          <h1 className="game-over-title">Game Over</h1>

          <div className="game-over-stats">
            <p>
              Your score: <span>{score}</span>
            </p>
            <p>
              Wrong answers: <span>{wrongAnswers}</span>
            </p>
          </div>

          <p className="game-over-result">{performanceLabel}</p>

          <div className="game-over-actions">
            <button
              className="replay-button"
              onClick={handleReplay}
              type="button"
            >
              Replay
            </button>

            <button
              className="home-button"
              onClick={onBackToHome}
              type="button"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRow) {
    return <div className="page">No current row found.</div>;
  }

  const isCorrect: boolean = selectedGuess === currentRow.type;

  const resultSprite: string =
    currentRow.type === "llama" ? llamaSprite : allamaSprite;

  return (
    <div className="page game-page">
      <div className="top-bar">
        <p className="timer">Time left: {timeLeft}s</p>
        <p className="score">Score: {score}</p>
      </div>
      <div className="game-card">
        <div className="couplet">
          {verses.map((line: string, index: number) => (
            <p key={`${currentRow.id}-${index}`} className="verse">
              {line}
            </p>
          ))}
        </div>

        <div className="button-row">
          <button
            className={`guess-button ${selectedGuess === "allama" ? "selected" : ""}`}
            onClick={() => handleGuess("allama")}
            disabled={showResult}
            type="button"
          >
            Allama
          </button>

          <button
            className={`guess-button ${selectedGuess === "llama" ? "selected" : ""}`}
            onClick={() => handleGuess("llama")}
            disabled={showResult}
            type="button"
          >
            Llama
          </button>
        </div>

        {showResult && (
          <div className="result-overlay">
            <div className={`result-popup ${isCorrect ? "correct" : "wrong"}`}>
              <img
                src={resultSprite}
                alt=""
                className="result-sprite sprite-1"
              />
              <img
                src={resultSprite}
                alt=""
                className="result-sprite sprite-2"
              />
              <img
                src={resultSprite}
                alt=""
                className="result-sprite sprite-3"
              />
              <img
                src={resultSprite}
                alt=""
                className="result-sprite sprite-4"
              />

              <p className="result-title">
                {isCorrect ? "Correct!" : "Incorrect!"}
              </p>

              <p className="result-subtitle"></p>
            </div>
          </div>
        )}
      </div>
      <div className="footer-row">
        <div className="footer-actions">
          <button className="home-button" onClick={onBackToHome} type="button">
            Back to Home
          </button>

          <button
            className="stop-button"
            onClick={handleStopPlaying}
            type="button"
          >
            Stop Playing
          </button>
        </div>
      </div>
    </div>
  );
}
