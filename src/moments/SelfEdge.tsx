"use client";

import { useEffect, useRef } from "react";
import Stage from "@/components/Stage";
import styles from "./SelfEdge.module.css";

/**
 * Moment 03 — The self-edge.
 *
 * A corrupt edge feeds off the self-node along a FIXED ray (~29°): it drains inward,
 * lunges to grab, the self-edge ring snaps out reflexively, the corrupt node recoils
 * along the same ray, the edge severs, the node falls away, and the ring settles into
 * a quiet pulsing glow that stays.
 *
 * The corrupt node and its edge are driven from ONE requestAnimationFrame clock:
 * `place(d)` sets the node center AND the line endpoint from the same point every
 * frame, so the edge stays welded to the node through every move. (A <line>'s
 * x1/y1/x2/y2 are not CSS-animatable, so CSS transitions on them are silently
 * ignored — hence the imperative timeline rather than keyframes.)
 */
const SelfEdge = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const cEdgeRef = useRef<SVGLineElement | null>(null);
  const cNodeRef = useRef<SVGCircleElement | null>(null);
  const capRef = useRef<SVGTextElement | null>(null);
  const sEdge1Ref = useRef<SVGLineElement | null>(null);
  const sEdge2Ref = useRef<SVGLineElement | null>(null);
  const sEdge3Ref = useRef<SVGLineElement | null>(null);
  const playRef = useRef<() => void>(() => {});

  useEffect(() => {
    const ring = ringRef.current;
    const cEdge = cEdgeRef.current;
    const cNode = cNodeRef.current;
    const cap = capRef.current;
    const container = containerRef.current;
    const sEdges = [sEdge1Ref.current, sEdge2Ref.current, sEdge3Ref.current];
    if (!ring || !cEdge || !cNode || !cap || !container || sEdges.some((e) => !e)) {
      return;
    }
    const edges = sEdges as SVGLineElement[];

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fixed ray out of the self-node (centre) toward the corrupt node's rest position.
    const cx = 340;
    const cy = 230;
    const ang = Math.atan2(350 - cy, 558 - cx);
    const ux = Math.cos(ang);
    const uy = Math.sin(ang);
    const pt = (d: number): [number, number] => [cx + ux * d, cy + uy * d];

    const dRest = 248;
    const dLunge = 66;
    const dBounce = 210;
    const dGone = 320;

    let timers: number[] = [];
    let pulseTimer: number | null = null;
    let drainTimer: number | null = null;
    let kickoff: number | null = null;
    let raf: number | null = null;
    let curD = dRest;

    const cancelRaf = () => {
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const clearAll = () => {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
      if (pulseTimer !== null) {
        clearInterval(pulseTimer);
        pulseTimer = null;
      }
      if (drainTimer !== null) {
        clearInterval(drainTimer);
        drainTimer = null;
      }
      cancelRaf();
    };
    const at = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    // Single source of truth for position: sets the node centre AND the edge endpoint.
    const place = (d: number) => {
      const p = pt(d);
      cNode.setAttribute("cx", String(p[0]));
      cNode.setAttribute("cy", String(p[1]));
      cEdge.setAttribute("x2", String(p[0]));
      cEdge.setAttribute("y2", String(p[1]));
    };

    const EASE: Record<string, (t: number) => number> = {
      lunge: (t) => t * t, // ease-in: the grab accelerates inward
      fall: (t) => t * t, // ease-in: the severed node falls away
      bounce: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const u = t - 1;
        return 1 + c3 * u * u * u + c1 * u * u; // easeOutBack: spring recoil overshoot
      },
    };

    const tween = (toD: number, dur: number, easeName: string, done?: () => void) => {
      cancelRaf();
      const fromD = curD;
      const ease = EASE[easeName] ?? ((t: number) => t);
      const ms = dur * 1000;
      let t0: number | null = null;
      const frame = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min(1, (ts - t0) / ms);
        curD = fromD + (toD - fromD) * ease(p);
        place(curD);
        if (p < 1) {
          raf = requestAnimationFrame(frame);
        } else {
          raf = null;
          curD = toD;
          place(curD);
          done?.();
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const reset = () => {
      clearAll();
      ring.style.transition = "none";
      ring.setAttribute("r", "0");
      ring.setAttribute("opacity", "0");
      ring.setAttribute("stroke-width", "3");
      cNode.style.transition = "none";
      cNode.setAttribute("opacity", "1");
      cNode.setAttribute("r", "10");
      cEdge.style.transition = "none";
      cEdge.setAttribute("opacity", "0.9");
      cEdge.setAttribute("stroke-dashoffset", "0");
      curD = dRest;
      place(dRest);
      cap.style.transition = "none";
      cap.style.opacity = "0";
      edges.forEach((e) => {
        e.style.transition = "none";
        e.setAttribute("opacity", "0.85");
        e.setAttribute("stroke-width", "2");
      });
    };

    const startPulse = () => {
      let on = false;
      pulseTimer = window.setInterval(() => {
        on = !on;
        ring.style.transition = "opacity 1.6s ease-in-out, r 1.6s ease-in-out";
        ring.setAttribute("opacity", on ? "0.34" : "0.20");
        ring.setAttribute("r", on ? "40" : "37");
      }, 1600);
    };

    // r and opacity are CSS-animatable; only the line endpoint isn't — so strip CSS
    // transitions here and let the rAF clock carry cx/cy + x2/y2 in lockstep.
    const moveTo = (d: number, dur: number, easeName: string) => {
      cNode.style.transition = "none";
      cEdge.style.transition = "none";
      tween(d, dur, easeName);
    };

    const play = () => {
      reset();

      if (reduce) {
        place(dBounce);
        cNode.setAttribute("opacity", "0.15");
        cNode.setAttribute("r", "14");
        cEdge.setAttribute("opacity", "0.07");
        ring.setAttribute("r", "38");
        ring.setAttribute("opacity", "0.30");
        edges.forEach((e) => e.setAttribute("opacity", "1"));
        cap.style.opacity = "1";
        return;
      }

      // Feed: corrupt edge dashes flow toward the consumer; the node swells as it drains.
      let fed = 10;
      let offset = 0;
      drainTimer = window.setInterval(() => {
        offset += 13;
        if (offset >= 84) offset -= 84;
        cEdge.style.transition = "stroke-dashoffset 0.9s linear";
        cEdge.setAttribute("stroke-dashoffset", String(offset));
        fed += 2.2;
        cNode.style.transition = "r 0.9s ease-in-out";
        cNode.setAttribute("r", String(fed));
      }, 900);

      at(2650, () => {
        if (drainTimer !== null) {
          clearInterval(drainTimer);
          drainTimer = null;
        }
        cEdge.style.transition = "stroke-dashoffset 0.15s linear";
        cEdge.setAttribute("stroke-dashoffset", "0");
      });

      at(2820, () => moveTo(dLunge, 0.34, "lunge")); // lunge inward to grab

      at(3080, () => {
        // self-edge ring snaps out reflexively
        ring.style.transition =
          "r 0.26s cubic-bezier(.2,.9,.3,1.5), opacity 0.18s ease-out";
        ring.setAttribute("r", "48");
        ring.setAttribute("opacity", "1");
      });

      at(3180, () => moveTo(dBounce, 0.5, "bounce")); // corrupt node recoils along the ray

      at(3400, () => {
        ring.style.transition = "r 0.5s cubic-bezier(.34,1.4,.64,1)";
        ring.setAttribute("r", "44");
      });

      at(3720, () => {
        // edge severs: fade opacity via CSS, drive position via the rAF clock so the
        // edge stays welded to the node as it falls away and dims out.
        cEdge.style.transition = "opacity 0.55s ease-out";
        cEdge.setAttribute("opacity", "0.06");
        cNode.style.transition = "opacity 0.9s ease-out";
        cNode.setAttribute("opacity", "0.10");
        tween(dGone, 0.9, "fall");
      });

      at(3920, () => {
        // the surviving sacred edges brighten — the network holds
        edges.forEach((e) => {
          e.style.transition = "opacity 0.7s ease-out, stroke-width 0.7s ease-out";
          e.setAttribute("opacity", "1");
          e.setAttribute("stroke-width", "2.4");
        });
      });

      at(4220, () => {
        // ring settles to a low, living glow
        ring.style.transition = "r 0.9s ease-in-out, opacity 0.9s ease-in-out";
        ring.setAttribute("r", "38");
        ring.setAttribute("opacity", "0.28");
      });

      at(5120, () => {
        cap.style.transition = "opacity 1s ease-in";
        cap.style.opacity = "1";
        startPulse();
      });
    };

    playRef.current = play;

    // Auto-play once when the moment scrolls into view (mirrors OrbitalEncounter).
    let hasPlayed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            hasPlayed = true;
            kickoff = window.setTimeout(play, 300);
          }
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (kickoff !== null) clearTimeout(kickoff);
      clearAll();
    };
  }, []);

  return (
    <Stage
      id="stage-self-edge"
      ariaLabel="Interactive: a corrupt edge reaches for the self-node, and the self-edge holds"
      label="Moment 03"
      title="Watch the self-edge hold."
    >
      <div ref={containerRef}>
        <svg
          className={styles.svg}
          viewBox="0 0 680 460"
          role="img"
          aria-label="A central self-node connected to three sacred nodes and one corrupt node feeding through an edge at a fixed angle. The corrupt node slides inward and lunges; a ring snaps outward from the self-node; the corrupt node recoils back along the line; the edge severs and the ring settles into a slow pulsing glow."
        >
          <line
            ref={sEdge1Ref}
            className={styles.sacredEdge}
            x1="340"
            y1="230"
            x2="150"
            y2="120"
            opacity="0.85"
          />
          <line
            ref={sEdge2Ref}
            className={styles.sacredEdge}
            x1="340"
            y1="230"
            x2="180"
            y2="350"
            opacity="0.85"
          />
          <line
            ref={sEdge3Ref}
            className={styles.sacredEdge}
            x1="340"
            y1="230"
            x2="520"
            y2="120"
            opacity="0.85"
          />

          <line
            ref={cEdgeRef}
            className={styles.corruptEdge}
            x1="340"
            y1="230"
            x2="558"
            y2="350"
            strokeDasharray="7 6"
            opacity="0.9"
          />

          <circle
            ref={ringRef}
            className={styles.selfRing}
            cx="340"
            cy="230"
            r="0"
            opacity="0"
          />
          <circle className={styles.selfNode} cx="340" cy="230" r="15" />

          <circle className={styles.sacredNode} cx="150" cy="120" r="10" />
          <circle className={styles.sacredNode} cx="180" cy="350" r="10" />
          <circle className={styles.sacredNode} cx="520" cy="120" r="10" />

          <circle ref={cNodeRef} className={styles.corruptNode} cx="558" cy="350" r="10" />

          <text
            ref={capRef}
            className={styles.caption}
            x="340"
            y="432"
            textAnchor="middle"
            style={{ opacity: 0 }}
          >
            The self-edge outranks any corrupt edge.
          </text>
        </svg>

        <div className={styles.replay}>
          <button
            type="button"
            className={styles.replayBtn}
            onClick={() => playRef.current()}
            aria-label="Replay the animation"
          >
            Watch again
          </button>
        </div>
      </div>
    </Stage>
  );
};

export default SelfEdge;
