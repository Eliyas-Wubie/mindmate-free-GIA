import { useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SpaceVis from "../games/SpaceVis";
import PercSpeed from "../games/PercSpeed";
import NumSpeed from "../games/NumSpeed";

const exercises = [
  {
    id: "vis",
    name: "Spatial visualization",
    tag: "A different perspective.",
    description:
      "Rotate shapes in your head. Find what fits. Give your spatial thinking a new angle.",
    skill: "Mental rotation",
    component: SpaceVis,
  },
  {
    id: "perc",
    name: "Perceptual speed",
    tag: "Catch the little things.",
    description:
      "Spot the match, cut through the noise, and turn a second look into a first instinct.",
    skill: "Pattern recognition",
    component: PercSpeed,
  },
  {
    id: "num",
    name: "Number speed",
    tag: "Make every second count.",
    description:
      "Find the distance between numbers. Practice quick decisions with a little precision.",
    skill: "Numerical accuracy",
    component: NumSpeed,
  },
];
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f2f0eb" },
    background: { default: "#080808", paper: "#151515" },
    text: { primary: "#f2f0eb", secondary: "#a6a39e" },
  },
  typography: { fontFamily: "Arial, Helvetica, sans-serif" },
  shape: { borderRadius: 2 },
});

function Sculpture() {
  return (
    <div className="sculpture" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="orbit-core" />
    </div>
  );
}

// Keep the complete board visible in short windows, including landscape phones.
function GameViewport({ children }) {
  const viewport = useRef(null);
  const canvas = useRef(null);
  useEffect(() => {
    const fit = () => {
      const { width, height } = viewport.current.getBoundingClientRect();
      const scale = Math.min(1, height / 560, width / 360);
      if (scale <= 0) return;
      Object.assign(canvas.current.style, {
        width: `${width / scale}px`,
        height: `${height / scale}px`,
        transform: `scale(${scale})`,
      });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={viewport} className="game-stage">
      <div ref={canvas} className="game-canvas">
        {children}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [screen, setScreen] = useState("welcome");
  const [game, setGame] = useState(null);
  const [limit, setLimit] = useState(10);
  const [session, setSession] = useState(0);
  const [sound, setSound] = useState(() => {
    try {
      return window.sessionStorage.getItem("mindmate-sound") === "on";
    } catch {
      // Sandboxed previews can deny access to the storage property itself.
      return false;
    }
  });
  const audio = useRef(null);
  const screenTitle = useRef(null);
  const active = exercises.find((item) => item.id === game);
  const Game = active?.component;
  useEffect(() => {
    screenTitle.current?.focus();
  }, [screen, game]);
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  function tick() {
    if (!sound) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audio.current ||= new AudioContext();
    const context = audio.current;
    context.resume();
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      220,
      context.currentTime + 0.12,
    );
    volume.gain.setValueAtTime(0.025, context.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.15);
  }

  function selectGame(id) {
    tick();
    setGame(id);
    setSession((value) => value + 1);
    setScreen("game");
  }
  return (
    <ThemeProvider theme={theme}>
      <div className={`app-shell screen-${screen}`}>
        <header className="site-header">
          <button
            className="wordmark"
            onClick={() => {
              setScreen("welcome");
              setGame(null);
            }}
            aria-label="MindMate home"
          >
            <img className="brand-logo" src="/logo.png" alt="" width="40" height="36" />
            <span>MindMate</span>
          </button>
          <span className="header-note">
            <span className="status-dot" /> A little sharper, every day.
          </span>
        </header>
        <main id="main">
          {screen === "welcome" ? (
            <section className="hero">
              <div className="hero-topline">
                <span className="eyebrow">THE EVERYDAY MIND GYM</span>
                <span className="eyebrow">
                  FOCUS. SPEED. A FRESH PERSPECTIVE.
                </span>
              </div>
              <Sculpture />
              <h1 ref={screenTitle} tabIndex={-1} className="hero-title">
                <span>A LITTLE</span>
                <span className="hero-middle">
                  MENTAL<span className="asterisk">✳</span>
                </span>
                <span className="outline-word">STRETCH.</span>
              </h1>
              <div className="hero-bottom">
                <p>
                  Your mind has potential.
                  <br />
                  Let's give it a little room to move.
                </p>
                <button
                  className="round-link"
                  onClick={() => {
                    tick();
                    setScreen("menu");
                  }}
                >
                  <span>Start playing</span>
                  <span className="circle-arrow">↗</span>
                </button>
              </div>
            </section>
          ) : screen === "menu" ? (
            <section className="selection-screen">
              <div className="screen-toolbar">
                <button
                  className="text-button"
                  onClick={() => setScreen("welcome")}
                >
                  ← Back
                </button>
                <span className="eyebrow">YOUR PACE. YOUR PRACTICE.</span>
              </div>
              <div className="menu-heading">
                <h1 ref={screenTitle} tabIndex={-1}>
                  Choose your
                  <br />
                  <span className="muted">mental stretch.</span>
                </h1>
                <p>
                  Three ways to switch on.
                  <br />
                  Pick a game and find your rhythm.
                </p>
              </div>
              <div className="exercise-list">
                {exercises.map((item, index) => (
                  <button
                    className="exercise-row"
                    key={item.id}
                    onClick={() => selectGame(item.id)}
                  >
                    <span className="exercise-number">0{index + 1}</span>
                    <span className="exercise-info">
                      <span className="exercise-skill">{item.skill}</span>
                      <span className="exercise-name">{item.name}</span>
                      <span className="exercise-description">
                        {item.description}
                      </span>
                    </span>
                    <span
                      className={`exercise-art art-${item.id}`}
                      aria-hidden="true"
                    >
                      {item.id === "vis"
                        ? "◈"
                        : item.id === "perc"
                          ? "a A"
                          : "03"}
                    </span>
                    <span className="exercise-arrow">↗</span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="training-screen" aria-label={active.name}>
              <div className="training-toolbar">
                <button
                  className="text-button"
                  onClick={() => {
                    setScreen("menu");
                    setGame(null);
                  }}
                >
                  ← Back to games
                </button>
                <h1 ref={screenTitle} tabIndex={-1} className="session-title">
                  {active.tag}
                </h1>
                <div className="session-controls">
                  <label className="limit-control">
                    TRIALS{" "}
                    <input
                      aria-label="Number of trials"
                      type="number"
                      min="1"
                      max="100"
                      value={limit}
                      onChange={(event) => {
                        setLimit(
                          Math.min(
                            100,
                            Math.max(
                              1,
                              Math.trunc(Number(event.target.value)) || 1,
                            ),
                          ),
                        );
                        setSession((value) => value + 1);
                      }}
                    />
                  </label>
                  <button
                    className="text-button"
                    onClick={() => setSession((value) => value + 1)}
                  >
                    Restart ↻
                  </button>
                </div>
              </div>
              <GameViewport>
                <Game key={`${game}-${session}`} limit={limit} />
              </GameViewport>
            </section>
          )}
        </main>
        <footer className="site-footer">
          <span>MADE FOR A MIND LIKE YOURS.</span>
          <button
            className="sound-toggle"
            aria-pressed={sound}
            onClick={() => {
              const next = !sound;
              setSound(next);
              try {
                window.sessionStorage.setItem("mindmate-sound", next ? "on" : "off");
              } catch {
                // React state keeps the toggle working when persistence is blocked.
              }
            }}
          >
            <span
              className={`sound-bars ${sound ? "playing" : ""}`}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </span>
            SOUND {sound ? "ON" : "OFF"}
          </button>
        </footer>
      </div>
    </ThemeProvider>
  );
}


