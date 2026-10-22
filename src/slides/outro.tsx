import React from "react";
import { AbsoluteFill } from "remotion";
import { C, F, MARBLES } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { clamp01, rnd } from "../deck/ui";
import { useAmbient } from "../deck/clock";

/* A program that writes programs: a radial syntax tree grows from the centre, sparks at its leaves,
   collapses back into the root in a flash and grows again, slowly turning. */
const CX = 960;
const CY = 715;
const DEPTH = 4;
const ARMS = 5;
const CYCLE = 12;
const LEN0 = 120;
const SHRINK = 0.74;
const SPREAD = 0.52;
const SPARKS = false;

type Seg = { x1: number; y1: number; x2: number; y2: number; d: number; leaf: boolean; id: number };
const SEGS: Seg[] = (() => {
  const out: Seg[] = [];
  let id = 0;
  const grow = (x: number, y: number, a: number, len: number, d: number) => {
    const x2 = x + len * Math.cos(a);
    const y2 = y + len * Math.sin(a);
    out.push({ x1: x, y1: y, x2, y2, d, leaf: d === DEPTH - 1, id: id++ });
    if (d === DEPTH - 1) return;
    const spread = SPREAD * (1 - d * 0.06);
    grow(x2, y2, a - spread, len * SHRINK, d + 1);
    grow(x2, y2, a + spread, len * SHRINK, d + 1);
  };
  for (let k = 0; k < ARMS; k++) grow(0, 0, (k / ARMS) * Math.PI * 2 - Math.PI / 2, LEN0, 0);
  return out;
})();

const ease = (v: number) => {
  const x = clamp01(v);
  return 1 - Math.pow(1 - x, 3);
};

const GrowingTree: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const u = (t % CYCLE) / CYCLE;
  const grow = ease(u / 0.5) * DEPTH;
  const collapse = ease((u - 0.82) / 0.13);
  const flash = 0.35 * Math.max(0, 1 - Math.abs(u - 0.96) / 0.04);
  const rot = t * 2;
  const scale = 1 - collapse * 0.97;
  const full = clamp01((u - 0.5) / 0.05) * (1 - collapse);
  const lines: React.ReactNode[] = [];
  const nodes: React.ReactNode[] = [];
  const sparks: React.ReactNode[] = [];
  for (const sg of SEGS) {
    const v = clamp01(grow - sg.d);
    if (v <= 0.01) continue;
    const x2 = sg.x1 + (sg.x2 - sg.x1) * v;
    const y2 = sg.y1 + (sg.y2 - sg.y1) * v;
    const col = sg.leaf ? C.amber : C.teal;
    lines.push(<line key={`l${sg.id}`} x1={sg.x1} y1={sg.y1} x2={x2} y2={y2} stroke={col} strokeWidth={Math.max(1, 3.2 - sg.d * 0.45)} strokeLinecap="round" opacity={0.45 + 0.35 * v} />);
    if (v > 0.98) {
      const tw = sg.leaf ? 0.6 + 0.4 * Math.sin(t * 1.5 + sg.id) : 1;
      nodes.push(<circle key={`n${sg.id}`} cx={sg.x2} cy={sg.y2} r={(sg.leaf ? 3.5 : 6 - sg.d * 0.8) * (0.8 + 0.2 * tw)} fill={col} />);
      if (SPARKS && sg.leaf && full > 0) {
        const life = ((t * 1.3 + rnd(sg.id)) % 1);
        const ang = Math.atan2(sg.y2 - sg.y1, sg.x2 - sg.x1) + (rnd(sg.id + 9) - 0.5) * 1.2;
        const dist = 18 + life * 70;
        sparks.push(
          <circle key={`s${sg.id}`} cx={sg.x2 + Math.cos(ang) * dist} cy={sg.y2 + Math.sin(ang) * dist} r={3.5 * (1 - life)} fill={MARBLES[sg.id % MARBLES.length]} opacity={full * (1 - life)} />,
        );
      }
    }
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, opacity: clamp01(p) }}>
      <defs>
        <filter id="tglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="rootGrad">
          <stop offset="0" stopColor={C.amber} />
          <stop offset="0.6" stopColor={C.amber} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.amber} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="thaze">
          <stop offset="0" stopColor={C.teal} stopOpacity="0.28" />
          <stop offset="1" stopColor={C.teal} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${CX} ${CY}) rotate(${rot}) scale(${scale})`}>
        <g filter="url(#tglow)">{lines}</g>
        <g filter="url(#tglow)">{nodes}</g>
        <g filter="url(#tglow)">{sparks}</g>
      </g>
      <circle cx={CX} cy={CY} r={20 + 120 * flash} fill="url(#rootGrad)" opacity={0.3 + flash} />
      <circle cx={CX} cy={CY} r={12 + 2 * Math.sin(t * 2)} fill="url(#rootGrad)" />
    </svg>
  );
};

const Outro: React.FC = () => {
  const { s } = useSteps();
  const words = ["Дякую", "за", "увагу!"];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #111a30 0%, #0a0f1d 75%)`, overflow: "hidden", userSelect: "none" }}>
      <GrowingTree p={s(0, 4)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: F.head, fontWeight: 700, fontSize: 142, color: C.text, textShadow: "0 6px 40px rgba(0,0,0,0.8)" }}>
        {words.map((w, i) => {
          const p = s(0, 6 + i * 6, POP);
          return (
            <span key={w} style={{ display: "inline-block", whiteSpace: "pre", opacity: clamp01(p), transform: `translateY(${(1 - p) * 40}px)` }}>
              {w + (i < words.length - 1 ? " " : "")}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", fontFamily: F.head, fontStyle: "italic", fontWeight: 500, fontSize: 44, color: C.dim, opacity: clamp01(s(0, 30)), textShadow: "0 4px 24px rgba(0,0,0,0.8)" }}>
        Питання?
      </div>
      <div style={{ position: "absolute", right: 96, bottom: 52, fontFamily: F.mono, fontSize: 22, fontWeight: 600, color: C.faint, opacity: clamp01(s(0, 40)) }}>made with Claude Opus 5.5</div>
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [300], C: Outro };
