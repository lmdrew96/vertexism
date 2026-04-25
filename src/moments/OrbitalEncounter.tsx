"use client";

import { useEffect, useRef, useState } from "react";
import Stage from "@/components/Stage";
import styles from "./OrbitalEncounter.module.css";

const OrbitalEncounter = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            setTimeout(() => {
              setPlaying(true);
              setPlayKey((k) => k + 1);
            }, 300);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const replay = () => {
    setPlaying(false);
    // Force restart by toggling key on next tick
    requestAnimationFrame(() => {
      setPlaying(true);
      setPlayKey((k) => k + 1);
    });
  };

  return (
    <Stage
      id="stage-1"
      ariaLabel="Interactive: the thesis, in five seconds"
      label="Moment 01"
      title="Watch for a moment."
    >
      <div
        ref={stageRef}
        key={playKey}
        className={playing ? styles.playing : ""}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 600 340"
          role="img"
          aria-label="Two dots fade in on opposite sides, then orbit each other spiraling inward until they touch at the center. They spring apart, and a line now connects them — the trail of their encounter."
        >
          <defs>
            <radialGradient id="m1-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DFA649" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#DFA649" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#DFA649" stopOpacity="0" />
            </radialGradient>
          </defs>
          <line
            className={styles.edge}
            x1="300"
            y1="170"
            x2="220"
            y2="170"
          />
          <line
            className={styles.edge}
            x1="300"
            y1="170"
            x2="380"
            y2="170"
          />
          <circle className={styles.halo} cx="300" cy="170" r="8" />
          <circle
            className={`${styles.dot} ${styles.dotA}`}
            cx="300"
            cy="170"
            r="9"
          />
          <circle
            className={`${styles.dot} ${styles.dotB}`}
            cx="300"
            cy="170"
            r="9"
          />
        </svg>

        <div className={styles.caption}>
          <div className={styles.captionLine}>
            The dot is not the thing that matters.
            <br />
            The line between is where the divine lives.
          </div>
        </div>

        <div className={styles.replay}>
          <button
            type="button"
            className={styles.replayBtn}
            onClick={replay}
            aria-label="Replay the animation"
          >
            Watch again
          </button>
        </div>
      </div>
    </Stage>
  );
};

export default OrbitalEncounter;
