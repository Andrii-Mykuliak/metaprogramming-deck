import React from "react";
import { C, F, MARBLES } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { clamp01, Slide } from "../deck/ui";
import { useAmbient } from "../deck/clock";

/* A syntax tree that keeps growing level by level, then folds back into its root. */
const DEPTH = 5;
const CYCLE = 10;
const ROOT = { x: 960, y: 520 };
const LEVEL_H = 108;

type N = { x: number; y: number; d: number; px: number; py: number; k: number };
const NODES: N[] = (() => {
  const out: N[] = [];
  const walk = (x: number, y: number, d: number, span: number, px: number, py: number, k: number) => {
    out.push({ x, y, d, px, py, k });
    if (d === DEPTH - 1) return;
    walk(x - span / 2, y + LEVEL_H, d + 1, span / 2, x, y, k * 2);
    walk(x + span / 2, y + LEVEL_H, d + 1, span / 2, x, y, k * 2 + 1);
  };
  walk(ROOT.x, ROOT.y, 0, 1500, ROOT.x, ROOT.y, 0);
  return out;
})();

const GrowingTree: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const u = (t % CYCLE) / CYCLE;
  const grow = clamp01(u / 0.55) * DEPTH;
  const fold = clamp01((u - 0.7) / 0.25) * DEPTH;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(p) }}>
      {NODES.map((n, i) => {
        const shown = clamp01(grow - n.d);
        const gone = clamp01(fold - (DEPTH - 1 - n.d));
        const v = shown * (1 - gone);
        if (v <= 0.01) return null;
        const x = n.px + (n.x - n.px) * v;
        const y = n.py + (n.y - n.py) * v;
        const c = MARBLES[n.d % MARBLES.length];
        const r = 18 - n.d * 2.4;
        return (
          <g key={i} opacity={v}>
            {n.d > 0 && <line x1={n.px} y1={n.py} x2={x} y2={y} stroke={C.line} strokeWidth={3} />}
            <circle cx={x} cy={y} r={r} fill={c} />
          </g>
        );
      })}
    </svg>
  );
};

const Outro: React.FC = () => {
  const { s } = useSteps();
  const words = ["Дякую", "за", "увагу!"];
  return (
    <Slide lanes={false}>
      <GrowingTree p={s(0, 10)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 120, letterSpacing: -2, color: C.text }}>
        {words.map((w, i) => {
          const p = s(0, 6 + i * 6, POP);
          return (
            <span key={w} style={{ display: "inline-block", whiteSpace: "pre", opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + (i < words.length - 1 ? " " : "")}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 370, textAlign: "center", fontFamily: F.body, fontWeight: 700, fontSize: 36, color: C.dim, opacity: clamp01(s(0, 30)) }}>
        Питання?
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 52, fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: C.faint, opacity: clamp01(s(0, 40)) }}>made with Claude Opus 5.5</div>
    </Slide>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
