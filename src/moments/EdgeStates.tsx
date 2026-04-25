"use client";

import { useState, type KeyboardEvent } from "react";
import Stage from "@/components/Stage";
import styles from "./EdgeStates.module.css";

type StateKey = "latent" | "sacred" | "residual" | "corrupt";

type EdgeStateDef = {
  key: StateKey;
  name: string;
  desc: string;
};

const STATES: EdgeStateDef[] = [
  {
    key: "latent",
    name: "Latent",
    desc: "Potential connection, not yet activated. The stranger on the bus — two dots in proximity, edge not yet firing. Only one side feels the pull. Pursuing it without reciprocity borders on corruption. Activation requires mutual opening: eye contact, a smile, a conversation.",
  },
  {
    key: "sacred",
    name: "Sacred",
    desc: "Mutual, alive, honoring both endpoints. Both nodes are aware, responsive, and respectful. The edge is bright with amber — divinity in action. This is what the rest of the essay points toward.",
  },
  {
    key: "residual",
    name: "Residual",
    desc: "The afterlife current. The node is gone, but the edge still vibrates — through artifacts, memory, lingering energy. Smells, sounds, signs. Maintained by the living through remembrance. These edges are real, not sentimental.",
  },
  {
    key: "corrupt",
    name: "Corrupt",
    desc: "Instrumentalized by one node to serve itself. The edge exists, but has been weaponized — pulling from one end, draining the other. A selfish lack of respect for the connection and the other node. Any edge that threatens another edge is corrupt.",
  },
];

const STATE_CLASS: Record<StateKey, string> = {
  latent: styles.latent,
  sacred: styles.sacred,
  residual: styles.residual,
  corrupt: styles.corrupt,
};

const EdgeStates = () => {
  const [idx, setIdx] = useState(0);
  const current = STATES[idx];

  const cycle = (delta: number) => {
    setIdx((prev) => (prev + delta + STATES.length) % STATES.length);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      cycle(1);
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      cycle(-1);
      e.preventDefault();
    }
  };

  return (
    <Stage
      id="stage-3"
      ariaLabel="Interactive: cycle through the four states of an edge"
      label="Moment 02"
      title={
        <>
          Four states of an edge.
          <br />
          Tap to cycle through them.
        </>
      }
    >
      <div
        className={`${styles.container} ${STATE_CLASS[current.key]}`}
        tabIndex={0}
        role="group"
        aria-label="Edge state cycler — use arrow keys or click to navigate"
        onKeyDown={onKeyDown}
      >
        <svg
          className={styles.svg}
          viewBox="0 0 600 260"
          role="img"
          aria-label="An edge between two nodes, cycling through four states."
        >
          <line
            className={styles.edgeHalo}
            x1="180"
            y1="130"
            x2="420"
            y2="130"
          />
          <line
            className={`${styles.edge} ${styles.interactive}`}
            x1="180"
            y1="130"
            x2="420"
            y2="130"
            onClick={() => cycle(1)}
          />

          <g transform="translate(180 130)">
            <g className={`${styles.node} ${styles.nodeA}`}>
              <circle className={styles.nodePulse} cx="0" cy="0" r="14" />
              <circle className={styles.nodeRing} cx="0" cy="0" r="16" />
              <circle className={styles.nodeCore} cx="0" cy="0" r="14" />
            </g>
          </g>

          <g transform="translate(420 130)">
            <g className={`${styles.node} ${styles.nodeB}`}>
              <circle className={styles.nodePulse} cx="0" cy="0" r="14" />
              <circle className={styles.nodeRing} cx="0" cy="0" r="16" />
              <circle className={styles.nodeCore} cx="0" cy="0" r="14" />
            </g>
          </g>
        </svg>

        <div className={styles.readout}>
          <div className={styles.counter}>
            {String(idx + 1).padStart(2, "0")} / 04
          </div>
          <div className={styles.stateName}>{current.name}</div>
          <div className={styles.description}>{current.desc}</div>
        </div>

        <div className={styles.controls} role="tablist" aria-label="Edge states">
          {STATES.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={`${styles.dotBtn} ${i === idx ? styles.active : ""}`}
              aria-label={s.name}
              aria-selected={i === idx}
              role="tab"
              onClick={() => setIdx(i)}
            />
          ))}
        </div>

        <div className={styles.hint}>Tap the edge or the dots</div>
      </div>
    </Stage>
  );
};

export default EdgeStates;
