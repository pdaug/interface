// made by ChatGPT 4.5
import { useEffect, useRef, useState } from "react";
import Button from "../buttons/Button";

const GAME_WIDTH = 520;
const GAME_HEIGHT = 260;
const DINO_SIZE = 40;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
const GRAVITY = 2;
const JUMP_HEIGHT = 80;

export default function DinoGame() {
  const [dinoBottom, setDinoBottom] = useState(0);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH);
  const [isJumping, setIsJumping] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const dinoBottomRef = useRef(dinoBottom);

  // Dino gravity
  useEffect(() => {
    if (!gameOver && !isJumping) {
      const interval = setInterval(() => {
        setDinoBottom((prev) => {
          const newPos = Math.max(prev - GRAVITY, 0);
          dinoBottomRef.current = newPos;
          return newPos;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isJumping, gameOver]);

  // Jump logic
  const jump = () => {
    if (gameOver || isJumping) return;
    setIsJumping(true);
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      setDinoBottom((prev) => {
        const newPos = prev + 10;
        dinoBottomRef.current = newPos;
        return newPos;
      });
      jumpCount += 10;
      if (jumpCount >= JUMP_HEIGHT) {
        clearInterval(jumpInterval);
        setIsJumping(false);
      }
    }, 20);
  };

  // Handle key press
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") jump();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Obstacle movement
  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setObstacleLeft((prev) => {
          if (prev < -OBSTACLE_WIDTH) {
            setScore((s) => s + 1);
            return GAME_WIDTH;
          }
          return prev - 5;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  // Collision
  useEffect(() => {
    const isColliding =
      obstacleLeft < 60 &&
      obstacleLeft + OBSTACLE_WIDTH > 20 &&
      dinoBottom < OBSTACLE_HEIGHT;

    if (isColliding) {
      setGameOver(true);
    }
  }, [obstacleLeft, dinoBottom]);

  const resetGame = () => {
    setDinoBottom(0);
    setObstacleLeft(GAME_WIDTH);
    setScore(0);
    setGameOver(false);
    dinoBottomRef.current = 0;
  };

  return (
    <div
      onClick={jump}
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        position: "relative",
        overflow: "hidden",
        margin: "1rem auto",
        background: "var(--backgroundColor)",
        borderRadius: "var(--borderRadius)",
        border: "1px solid var(--borderColor)",
        fontFamily: "sans-serif",
        userSelect: "none",
      }}
    >
      {/* Dino */}
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: dinoBottom,
          width: DINO_SIZE,
          height: DINO_SIZE,
          backgroundColor: "red",
        }}
      />

      {/* Obstacle */}
      <div
        style={{
          position: "absolute",
          left: obstacleLeft,
          bottom: 0,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
          backgroundColor: "black",
        }}
      />

      {/* Score */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {score}
      </div>

      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Button category="Danger" text="Restart" onClick={resetGame} />
        </div>
      )}
    </div>
  );
}
