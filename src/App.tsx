import { useState } from "react";
import GamePage from "./pages/GamePage";
import ArcadeBackdrop from "./components/ArcadeBackdrop";

type Screen = "home" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  if (screen === "home") {
    return (
      <div className="arcade-page-shell">
        <ArcadeBackdrop />

        <div className="page page-content">
          <div className="home-card">
            <h3 className="home-subtitle">who said it</h3>
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
      </div>
    );
  }

  return <GamePage onBackToHome={() => setScreen("home")} />;
}
