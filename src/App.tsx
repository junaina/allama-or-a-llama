import { useEffect, useRef, useState } from "react";
import GamePage from "./pages/GamePage";
import ArcadeBackdrop from "./components/ArcadeBackdrop";

type Screen = "home" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const homeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const homeAudio = new Audio("/sounds/home-screen.mp3");
    homeAudio.loop = true;
    homeAudio.volume = 0.25;
    homeAudio.preload = "auto";

    homeAudioRef.current = homeAudio;

    return () => {
      homeAudio.pause();
      homeAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const homeAudio = homeAudioRef.current;

    if (!homeAudio) {
      return;
    }

    if (screen === "home") {
      void homeAudio.play().catch(() => {
        // browser may block autoplay until user interacts
      });
      return;
    }

    homeAudio.pause();
    homeAudio.currentTime = 0;
  }, [screen]);

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
