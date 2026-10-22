import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, clamp01, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { useAmbient } from "../deck/clock";
import { Num } from "./kit";

const ease = (v: number) => {
  const x = clamp01(v);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};
const seg = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));

/* Title: the program `2 + 3 * 4` becomes a tree and folds itself, forever. */
export const TreeNode: React.FC<{ x: number; y: number; label: string; color: string; p?: number; glow?: number; w?: number; size?: number }> = ({
  x,
  y,
  label,
  color,
  p = 1,
  glow = 0,
  w = 150,
  size = 30,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - 32,
      width: w,
      height: 64,
      borderRadius: 16,
      border: `3px solid ${color}`,
      background: `linear-gradient(180deg, ${color}30, ${color}12), ${C.bg}`,
      boxShadow: glow > 0.02 ? `0 0 ${34 * glow}px ${color}` : undefined,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: size,
      color,
      opacity: clamp01(p),
      transform: `scale(${mix(0.6, 1, clamp01(p))})`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </div>
);

export const Edge: React.FC<{ x1: number; y1: number; x2: number; y2: number; p?: number }> = ({ x1, y1, x2, y2, p = 1 }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
    <path d={`M ${x1} ${y1 + 32} C ${x1} ${y1 + 70}, ${x2} ${y2 - 70}, ${x2} ${y2 - 32}`} fill="none" stroke={C.dim} strokeWidth={3} opacity={0.6 * clamp01(p)} />
  </svg>
);

const CYCLE = 9;

const FoldLoop: React.FC<{ p: number }> = ({ p }) => {
  const t = useAmbient();
  const u = (t % CYCLE) / CYCLE;
  const tree = seg(u, 0.12, 0.24);
  const fold1 = ease(seg(u, 0.38, 0.5));
  const fold2 = ease(seg(u, 0.6, 0.72));
  const fade = 1 - seg(u, 0.9, 1);
  const TOP = 660;
  const ROOT = { x: 560, y: TOP };
  const N2 = { x: 400, y: TOP + 130 };
  const MUL = { x: 720, y: TOP + 130 };
  const N3 = { x: 620, y: TOP + 260 };
  const N4 = { x: 820, y: TOP + 260 };
  const kids = 1 - fold1;
  const mulGlow = Math.max(0, 1 - Math.abs(u - 0.5) / 0.06);
  const rootGlow = Math.max(0, 1 - Math.abs(u - 0.72) / 0.06);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: clamp01(p) * fade }}>
      <div style={{ position: "absolute", left: 96, top: TOP - 30, fontFamily: F.mono, fontWeight: 700, fontSize: 52, color: C.text, opacity: 1 - tree * 0.65 }}>
        2 + 3 * 4
      </div>
      <Edge x1={ROOT.x} y1={ROOT.y} x2={N2.x} y2={N2.y} p={tree * (1 - fold2)} />
      <Edge x1={ROOT.x} y1={ROOT.y} x2={MUL.x} y2={MUL.y} p={tree * (1 - fold2)} />
      <Edge x1={MUL.x} y1={MUL.y} x2={mix(N3.x, MUL.x, fold1)} y2={mix(N3.y, MUL.y, fold1)} p={tree * kids} />
      <Edge x1={MUL.x} y1={MUL.y} x2={mix(N4.x, MUL.x, fold1)} y2={mix(N4.y, MUL.y, fold1)} p={tree * kids} />
      <TreeNode x={mix(N3.x, MUL.x, fold1)} y={mix(N3.y, MUL.y, fold1)} label="3" color={C.amber} p={tree * kids} w={90} />
      <TreeNode x={mix(N4.x, MUL.x, fold1)} y={mix(N4.y, MUL.y, fold1)} label="4" color={C.amber} p={tree * kids} w={90} />
      <TreeNode x={mix(N2.x, ROOT.x, fold2)} y={mix(N2.y, ROOT.y, fold2)} label="2" color={C.amber} p={tree * (1 - fold2)} w={90} />
      <TreeNode x={mix(MUL.x, ROOT.x, fold2)} y={mix(MUL.y, ROOT.y, fold2)} label={fold1 > 0.5 ? "12" : "*"} color={fold1 > 0.5 ? C.amber : C.violet} p={tree * (1 - fold2)} glow={mulGlow} w={fold1 > 0.5 ? 100 : 90} />
      <TreeNode x={ROOT.x} y={ROOT.y} label={fold2 > 0.5 ? "14" : "+"} color={fold2 > 0.5 ? C.teal : C.violet} p={tree} glow={rootGlow} w={100} />
    </div>
  );
};

const TitleSlide: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <At x={96} y={150} step={0} delay={4} size={34} weight={500} color={C.teal} font={F.head} style={{ letterSpacing: 6 }}>
        ЛЕКЦІЯ 13
      </At>
      <At x={90} y={232} step={0} delay={10} size={112} weight={700} font={F.head} style={{ letterSpacing: -2, lineHeight: 1.05 }}>
        Метапрограмування
      </At>
      <At x={96} y={386} step={0} delay={22} size={38} weight={700} color={C.dim}>
        програми, які аналізують і створюють інші програми
      </At>
      <FoldLoop p={s(0, 30)} />
      <AuthorBlock />
    </Slide>
  );
};

/* Epigraph: a tiny core vocabulary grows into new words built from it. */
const CORE = ["if", "not", "define", "lambda"];
const GROWN = [
  { w: "unless", from: [0, 1] },
  { w: "swap!", from: [2, 3] },
  { w: "for-each", from: [2, 3] },
  { w: "when", from: [0] },
];

const ROW_Y = (i: number) => 566 + i * 74;
const CORE_X = 360;
const GROWN_X = 1460;
const CHIP_W = 220;

const Vocabulary: React.FC = () => {
  const { s } = useSteps();
  const chip = (x: number, y: number, label: string, color: string, p: number) => (
    <div key={label} style={{ position: "absolute", left: x - CHIP_W / 2, top: y - 28, width: CHIP_W, height: 56, borderRadius: 28, border: `2.5px solid ${color}`, background: `linear-gradient(180deg, ${color}26, ${color}10), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 28, color, opacity: clamp01(p), transform: `scale(${mix(0.6, 1, clamp01(p))})` }}>
      {label}
    </div>
  );
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {GROWN.map((g, i) =>
          g.from.map((f) => {
            const x1 = CORE_X + CHIP_W / 2 + 8;
            const x2 = GROWN_X - CHIP_W / 2 - 8;
            const y1 = ROW_Y(f);
            const y2 = ROW_Y(i);
            return (
              <path
                key={`${i}-${f}`}
                d={`M ${x1} ${y1} C ${x1 + 360} ${y1}, ${x2 - 360} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={C.violet}
                strokeWidth={2.5}
                opacity={0.5 * clamp01(s(0, 120 + i * 12))}
              />
            );
          }),
        )}
      </svg>
      <At x={CORE_X - CHIP_W / 2} y={492} step={0} delay={96} size={24} weight={800} color={C.dim} style={{ letterSpacing: 2, textTransform: "uppercase" }}>
        ядро мови
      </At>
      {CORE.map((c, i) => chip(CORE_X, ROW_Y(i), c, C.teal, s(0, 100 + i * 4, POP)))}
      <At x={GROWN_X - CHIP_W / 2} y={492} step={0} delay={116} size={24} weight={800} color={C.dim} style={{ letterSpacing: 2, textTransform: "uppercase" }}>
        нові слова
      </At>
      {GROWN.map((g, i) => chip(GROWN_X, ROW_Y(i), g.w, C.violet, s(0, 126 + i * 12, POP)))}
    </>
  );
};

const LINE1 = "A good programmer in these times does not just write programs.".split(" ");
const LINE2 = "A good programmer builds a working vocabulary.".split(" ");

const QuoteSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (ws: string[], base: number, hl: string[]) =>
    ws.map((w, i) => {
      const p = s(0, base + i * 2.6, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", color: hl.includes(w) ? C.teal : undefined, opacity: clamp01(p), transform: `translateY(${(1 - p) * 34}px)` }}>
          {w + " "}
        </span>
      );
    });
  return (
    <Slide>
      <div style={{ position: "absolute", left: 120, top: 150, width: 1680, fontFamily: F.head, fontSize: 52, fontWeight: 500, lineHeight: 1.3, color: C.text }}>
        {words(LINE1, 4, [])}
        <br />
        {words(LINE2, 40, ["vocabulary."])}
      </div>
      <At x={124} y={400} step={0} delay={70} size={30} weight={700} color={C.dim}>
        Guy L. Steele Jr., «Growing a Language», OOPSLA 1998
      </At>
      <Vocabulary />
      <At x={120} y={880} w={1680} step={1} size={36} weight={700}>
        Хороший програміст сьогодні не просто пише програми, а <span style={{ color: C.teal }}>розширює словник</span> мови. Метапрограмування дає для цього інструменти.
      </At>
    </Slide>
  );
};

const AGENDA = [
  "Поняття, рівні та види метапрограмування",
  "Програма як дані: синтаксис, AST і перетворення",
  "Під час компіляції: макроси та генерація коду",
  "Під час виконання: рефлексія та побудова виразів",
  "Застосування, обмеження і зв’язок із декларативним",
];
const AG_C = [C.teal, C.amber, C.violet, C.coral, C.blue];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  return (
    <Slide title="План">
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = !full && i === active ? s(0, 10) : 0;
        const dim = full || i === active ? 1 : 0.32;
        const color = AG_C[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 96,
              top: 220 + i * 142,
              width: 1560,
              height: 112,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 30px",
              borderRadius: 20,
              boxSizing: "border-box",
              border: `2px solid ${on > 0.5 ? color : "transparent"}`,
              background: on > 0.5 ? `${color}14` : undefined,
              boxShadow: on > 0.5 ? `0 0 ${30 * on}px ${color}55` : undefined,
              opacity: clamp01(p) * dim,
              transform: `translateX(${(1 - p) * -40}px)`,
            }}
          >
            <Num n={i + 1} color={color} />
            <div style={{ fontFamily: F.body, fontSize: 44, fontWeight: 800, color: C.text, whiteSpace: "nowrap" }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  { id: "quote", title: "Епіграф", steps: [190, 70], C: QuoteSlide },
  { id: "agenda", title: "План", steps: [70], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
