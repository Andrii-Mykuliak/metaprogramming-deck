import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Edge, TreeNode } from "./intro";

const ease = (v: number) => {
  const x = clamp01(v);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

/* AST: tokens of `2 + 3 * 4` fly into a tree */
const TOKENS = [
  { t: "2", to: 1, c: C.amber },
  { t: "+", to: 0, c: C.violet },
  { t: "3", to: 3, c: C.amber },
  { t: "*", to: 2, c: C.violet },
  { t: "4", to: 4, c: C.amber },
];
const NODES = [
  { x: 1300, y: 330, label: "Add" },
  { x: 1120, y: 490, label: "Number(2)" },
  { x: 1480, y: 490, label: "Multiply" },
  { x: 1340, y: 650, label: "Number(3)" },
  { x: 1620, y: 650, label: "Number(4)" },
];

const Ast: React.FC = () => {
  const { s, lin } = useSteps();
  const fly = (i: number) => ease(lin(2, i * 8, 36));
  const tree = s(2, 50);
  return (
    <Slide title="Абстрактне синтаксичне дерево">
      <Lead size={34}>
        <A>AST</A> – деревоподібне представлення програми: вузли відповідають значущим конструкціям – операціям, літералам, викликам, умовам.
      </Lead>
      {TOKENS.map((tk, i) => {
        const u = fly(i);
        const start = { x: 230 + i * 90, y: 450 };
        const end = NODES[tk.to];
        const p = s(1, i * 4, POP);
        return (
          <div key={i} style={{ position: "absolute", left: mix(start.x, end.x, u) - 30, top: mix(start.y, end.y, u) - 36 - Math.sin(Math.PI * u) * 80, width: 60, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 64, color: tk.c, opacity: clamp01(p) * (1 - clamp01((u - 0.8) / 0.2)) }}>
            {tk.t}
          </div>
        );
      })}
      <Edge x1={NODES[0].x} y1={NODES[0].y} x2={NODES[1].x} y2={NODES[1].y} p={tree} />
      <Edge x1={NODES[0].x} y1={NODES[0].y} x2={NODES[2].x} y2={NODES[2].y} p={tree} />
      <Edge x1={NODES[2].x} y1={NODES[2].y} x2={NODES[3].x} y2={NODES[3].y} p={tree} />
      <Edge x1={NODES[2].x} y1={NODES[2].y} x2={NODES[4].x} y2={NODES[4].y} p={tree} />
      {NODES.map((n, i) => (
        <TreeNode key={i} x={n.x} y={n.y} label={n.label} color={i === 0 || i === 2 ? C.violet : C.amber} p={s(2, 30 + i * 4, POP)} w={i === 0 ? 120 : 210} size={28} />
      ))}
      <At x={96} y={560} w={820} step={3} size={32} weight={700}>
        Пріоритет операцій робить множення <A c={C.violet}>вкладеним</A> у правий операнд додавання.
      </At>
      <Panel x={96} y={760} w={1728} h={150} title="AST і конкретне синтаксичне дерево" color={C.teal} p={s(4, 0, POP)} pad="10px 26px">
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, color: C.text }}>AST відкидає другорядні лексичні деталі – окремі дужки й пробіли, якщо вони не впливають на структуру.</div>
      </Panel>
    </Slide>
  );
};

/* Constant folding */
const Folding: React.FC = () => {
  const { s } = useSteps();
  const f1 = ease(s(1, 10));
  const f2 = ease(s(2, 10));
  const R = { x: 960, y: 380 };
  const L = { x: 700, y: 560 };
  const M = { x: 1220, y: 560 };
  const A3 = { x: 1060, y: 740 };
  const A4 = { x: 1380, y: 740 };
  const k = 1 - f1;
  const mLabel = f1 > 0.5 ? "Number(12)" : "Multiply";
  return (
    <Slide title="Згортання констант">
      <Lead size={36}>Дерево дає змогу перетворювати програму без неструктурованих текстових замін.</Lead>
      <Edge x1={R.x} y1={R.y} x2={mix(L.x, R.x, f2)} y2={mix(L.y, R.y, f2)} p={1 - f2} />
      <Edge x1={R.x} y1={R.y} x2={mix(M.x, R.x, f2)} y2={mix(M.y, R.y, f2)} p={1 - f2} />
      <Edge x1={M.x} y1={M.y} x2={mix(A3.x, M.x, f1)} y2={mix(A3.y, M.y, f1)} p={k} />
      <Edge x1={M.x} y1={M.y} x2={mix(A4.x, M.x, f1)} y2={mix(A4.y, M.y, f1)} p={k} />
      <TreeNode x={mix(A3.x, M.x, f1)} y={mix(A3.y, M.y, f1)} label="Number(3)" color={C.amber} p={k} w={210} size={28} />
      <TreeNode x={mix(A4.x, M.x, f1)} y={mix(A4.y, M.y, f1)} label="Number(4)" color={C.amber} p={k} w={210} size={28} />
      <TreeNode x={mix(L.x, R.x, f2)} y={mix(L.y, R.y, f2)} label="Number(2)" color={C.amber} p={1 - f2} w={210} size={28} />
      <TreeNode x={mix(M.x, R.x, f2)} y={mix(M.y, R.y, f2)} label={mLabel} color={f1 > 0.5 ? C.amber : C.violet} p={1 - f2} w={f1 > 0.5 ? 230 : 180} size={28} glow={f1 > 0.5 && f1 < 1 ? 1 : 0} />
      <TreeNode x={R.x} y={R.y} label={f2 > 0.5 ? "Number(14)" : "Add"} color={f2 > 0.5 ? C.teal : C.violet} w={f2 > 0.5 ? 230 : 120} size={28} glow={f2 > 0.5 && f2 < 1 ? 1 : 0} />
      <At x={96} y={840} w={1728} step={1} delay={30} size={30} weight={700} font={F.mono} color={C.dim}>
        Multiply(Number(3), Number(4)) → Number(12)
      </At>
      <At x={96} y={890} w={1728} step={2} delay={30} size={30} weight={700} font={F.mono} color={C.dim}>
        Add(Number(2), Number(12)) → Number(14)
      </At>
      <At x={96} y={950} w={1728} step={3} size={32} weight={700}>
        Таке спрощення називають <A>згортанням констант</A> (constant folding).
      </At>
    </Slide>
  );
};

/* Haskell model */
const HsModel: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Модель мови в Haskell">
      <Lead size={34}>
        Мінімальну мову арифметичних виразів описує алгебраїчний тип, а перетворення дерева – звичайна функція.
      </Lead>
      <Code
        lang="hs"
        x={96}
        y={322}
        size={28}
        step={1}
        stagger={4}
        code={`
          [[1@20~200|data Expr = Num Int | Add Expr Expr | Mul Expr Expr]]
            deriving (Show, Eq)

          simplify :: Expr -> Expr
          [[2|simplify (Add a b) =]]
            case (simplify a, simplify b) of
              (Num x, Num y) -> Num (x + y)
              (x, y)         -> Add x y
          [[3|simplify (Mul a b) =]]
            case (simplify a, simplify b) of
              (Num x, Num y) -> Num (x * y)
              (x, y)         -> Mul x y
          simplify n = n

          @4 example = Add (Num 2) (Mul (Num 3) (Num 4))
          @4+10 -- simplify example == Num 14
        `}
      />
      <Panel x={1180} y={300} w={644} h={170} title="Тип Expr" color={C.violet} p={s(1, 10, POP)} pad="8px 24px">
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, lineHeight: 1.36, color: C.text }}>рекурсивна структура: вузол містить інші вирази</div>
      </Panel>
      <Panel x={1180} y={500} w={644} h={210} title="Рекурсія вниз" color={C.amber} p={s(2, 0, POP)} pad="8px 24px">
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, lineHeight: 1.36, color: C.text }}>спершу спрощуємо піддерева; якщо обидва стали числами, обчислюємо вузол</div>
      </Panel>
      <Panel x={1180} y={740} w={644} h={170} title="Чисте перетворення" color={C.teal} p={s(3, 0, POP)} pad="8px 24px">
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, lineHeight: 1.36, color: C.text }}>те саме дерево завжди дає той самий результат</div>
      </Panel>
    </Slide>
  );
};

/* Pure model vs real language */
const REAL = ["області видимості", "зв’язування імен", "типи", "перевантаження операцій", "контекст"];

const RealLang: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Від моделі до реальної мови">
      <Panel x={96} y={220} w={850} h={420} title="Функція simplify" color={C.teal} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 31, lineHeight: 1.4, color: C.text, marginTop: 8 }}>
          Чисте перетворення даних: не виконує довільного тексту й не звертається до середовища виконання.
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 31, lineHeight: 1.4, color: C.dim, marginTop: 22 }}>
          Частину роботи компілятора можна описати звичайними функціями над моделлю синтаксису.
        </div>
      </Panel>
      <Panel x={974} y={220} w={850} h={420} title="AST реальної мови" color={C.coral} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 31, color: C.text, marginTop: 8 }}>Потрібно враховувати:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 20 }}>
          {REAL.map((r, i) => (
            <Chip key={r} color={C.coral} size={26} style={{ fontFamily: F.body, opacity: clamp01(s(2, 10 + i * 6, POP)) }}>
              {r}
            </Chip>
          ))}
        </div>
      </Panel>
      <At x={96} y={700} w={1728} step={3} size={36} weight={700}>
        Коректне перетворення зберігає потрібну семантику. Формально однакова <A c={C.coral}>текстова заміна</A> ще не гарантує еквівалентності програм.
      </At>
    </Slide>
  );
};

/* Desugaring */
const Desugar: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Розгортання синтаксичного цукру">
      <Lead size={34}>
        <A>Desugaring</A> перетворює зручні поверхневі конструкції на простіші базові, не змінюючи змісту.
      </Lead>
      <div style={{ position: "absolute", left: 96, top: 300, display: "flex", alignItems: "center", gap: 40, opacity: clamp01(s(1, 0, POP)) }}>
        <Chip color={C.amber} size={44}>x += 1</Chip>
        <span style={{ fontFamily: F.mono, fontSize: 44, color: C.dim }}>⇒</span>
        <Chip color={C.teal} size={44}>x = x + 1</Chip>
      </div>
      <Panel x={96} y={440} w={1728} h={330} title="Пастка: побічні ефекти" color={C.coral} p={s(2, 0, POP)}>
        <Code
          x={30}
          y={70}
          size={34}
          step={2}
          stagger={20}
          style={{ position: "relative", left: 0, top: 0 }}
          code={`
            a[f()] += 1
            @3 a[[[!3@20|f()]]] = a[[[!3@26|f()]]] + 1     // наївно: f() двічі
            @4 const i = f(); a[i] = a[i] + 1   // правильно: f() один раз
          `}
        />
      </Panel>
      <At x={96} y={810} w={1728} step={5} size={30} weight={700}>
        Тому розгортання виконують над структурованим представленням з урахуванням семантики. У курсі Brown CSCI 1730 студенти пишуть окремий desugarer, що зводить розширений синтаксис до ядра мови.
      </At>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "ast", title: "AST", steps: [40, 30, 90, 50, 50], C: Ast },
  { id: "folding", title: "Згортання констант", steps: [40, 70, 70, 50], C: Folding },
  { id: "hs-model", title: "Модель мови в Haskell", steps: [30, 90, 40, 40, 50], C: HsModel },
  { id: "real", title: "Від моделі до реальної мови", steps: [30, 40, 60, 50], C: RealLang },
  { id: "desugar", title: "Desugaring", steps: [40, 40, 40, 60, 50, 50], C: Desugar },
];

