import { useState } from "react";
import GamePage from "./pages/GamePage";

type Screen = "home" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "home") {
    return (
      <div className="page">
        <div className="game-card home-card">
          <h1 className="home-title">Allama or a Llama</h1>

          <button
            className="start-button"
            onClick={() => setScreen("game")}
            type="button"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return <GamePage onBackToHome={() => setScreen("home")} />;
}
