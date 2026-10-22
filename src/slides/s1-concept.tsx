import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, Arrow, At, clamp01, Lead, Panel, pulse, Slide } from "../deck/ui";
import { Edge, TreeNode } from "./intro";

/* Definition: the same `2 + 3` as an instruction and as a value */
const Definition: React.FC = () => {
  const { s } = useSteps();
  const run = s(2, 10, POP);
  const tree = s(3, 10);
  return (
    <Slide title="Що таке метапрограмування">
      <Lead size={36}>
        <A>Метапрограма</A> аналізує, створює або перетворює представлення інших програм: синтаксис, типи, метадані.
      </Lead>
      <div style={{ position: "absolute", left: 860, top: 330, width: 200, textAlign: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 60, color: C.text, opacity: clamp01(s(1, 0, POP)) }}>2 + 3</div>
      <Arrow x1={880} y1={430} x2={560} y2={520} step={2} color={C.amber} curve={-30} />
      <Arrow x1={1040} y1={430} x2={1360} y2={520} step={3} color={C.violet} curve={30} />
      <Panel x={160} y={540} w={720} h={300} title="Код як інструкція" color={C.amber} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text, marginTop: 8 }}>Вираз виконується і дає значення.</div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 30, opacity: clamp01(run) }}>
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 46, color: C.text }}>2 + 3</span>
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 46, color: C.dim }}>⇒</span>
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 56, color: C.amber, textShadow: `0 0 20px ${C.amber}` }}>5</span>
        </div>
      </Panel>
      <Panel x={1040} y={540} w={720} h={300} title="Код як значення" color={C.violet} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text, marginTop: 8 }}>Вираз – дерево, яке можна дослідити й змінити.</div>
      </Panel>
      <Edge x1={1400} y1={700} x2={1300} y2={790} p={tree} />
      <Edge x1={1400} y1={700} x2={1500} y2={790} p={tree} />
      <TreeNode x={1400} y={700} label="Add" color={C.violet} p={tree} w={110} size={28} />
      <TreeNode x={1300} y={790} label="2" color={C.amber} p={s(3, 18)} w={80} size={28} />
      <TreeNode x={1500} y={790} label="3" color={C.amber} p={s(3, 22)} w={80} size={28} />
      <At x={96} y={890} w={1728} step={4} size={32} weight={700}>
        Об’єктом перетворення може бути навіть частина тієї самої програми, у якій працює метапрограма.
      </At>
    </Slide>
  );
};

/* When: metaprogramming is not self-modification */
const WHEN = [
  { t: "До запуску", d: "генератор створює вихідний код", c: C.teal, x: 330 },
  { t: "Під час компіляції", d: "макрос перетворює дерево синтаксису", c: C.amber, x: 960 },
  { t: "Під час виконання", d: "рефлексія читає метадані, будується опис обчислення", c: C.violet, x: 1590 },
];

const When: React.FC = () => {
  const { s, lin, t } = useSteps();
  const draw = lin(1, 0, 30);
  return (
    <Slide title="Коли працює метапрограма">
      <Lead size={36}>
        Слово «мета» не означає, що програма <A c={C.coral}>обов’язково змінює саму себе</A>. Метапрограмування може працювати на різних етапах.
      </Lead>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={150} y1={480} x2={mix(150, 1780, draw)} y2={480} stroke={C.line} strokeWidth={5} strokeLinecap="round" />
        <polygon points="1804,480 1780,467 1780,493" fill={C.line} opacity={draw > 0.97 ? 1 : 0} />
      </svg>
      {WHEN.map((w, i) => {
        const d = 14 + i * 20;
        const p = s(1, d, POP);
        return (
          <React.Fragment key={w.t}>
            <div style={{ position: "absolute", left: w.x - 22, top: 458, width: 44, height: 44, borderRadius: 22, background: w.c, boxShadow: `0 0 ${30 * pulse(t(1, d), 6, 22)}px ${w.c}`, opacity: clamp01(p), transform: `scale(${p})` }} />
            <div style={{ position: "absolute", left: w.x - 260, width: 520, top: 380, textAlign: "center", fontFamily: F.head, fontSize: 34, fontWeight: 500, color: w.c, opacity: clamp01(p) }}>{w.t}</div>
            <Panel x={w.x - 260} y={540} w={520} h={170} color={w.c} p={s(1, d + 6)}>
              <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.36, color: C.text }}>{w.d}</div>
            </Panel>
          </React.Fragment>
        );
      })}
      <At x={96} y={770} w={1728} step={2} size={32} weight={700} color={C.dim}>
        Результат
      </At>
      <div style={{ position: "absolute", left: 96, top: 830, display: "flex", gap: 20, flexWrap: "wrap", width: 1728 }}>
        {["новий вихідний код", "змінене дерево синтаксису", "налаштовані компоненти", "виконуваний опис обчислення"].map((r, i) => (
          <div key={r} style={{ padding: "12px 26px", borderRadius: 30, border: `2.5px solid ${C.teal}`, background: `${C.teal}14`, fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.text, opacity: clamp01(s(2, 6 + i * 6, POP)) }}>
            {r}
          </div>
        ))}
      </div>
    </Slide>
  );
};

/* Kinds */
const KINDS = [
  { m: "Синтаксичні макроси", what: "фрагменти синтаксису, токени, синтаксичні об’єкти", when: "до або під час компіляції", c: C.amber },
  { m: "Генерація вихідного коду", what: "модель, метадані → нові файли й оголошення", when: "під час збірки або компіляції", c: C.teal },
  { m: "Рефлексія", what: "інформація про типи й компоненти, доступна під час виконання", when: "під час виконання", c: C.violet },
  { m: "Динамічне конструювання програм", what: "дерева виразів, об’єкти коду, правила виконання", when: "залежно від середовища", c: C.coral },
];

const Kinds: React.FC = () => {
  const { s } = useSteps();
  const COLS = [96, 640, 1340];
  const W = [520, 680, 484];
  return (
    <Slide title="Основні різновиди">
      {["Механізм", "Що обробляється", "Коли застосовується"].map((h, i) => (
        <At key={h} x={COLS[i] + (i === 0 ? 30 : 0)} y={200} step={0} delay={10 + i * 4} size={26} weight={800} color={C.dim} style={{ letterSpacing: 2, textTransform: "uppercase" }}>
          {h}
        </At>
      ))}
      {KINDS.map((k, i) => {
        const p = s(i + 1, 0, POP);
        const y = 262 + i * 168;
        return (
          <React.Fragment key={k.m}>
            <Panel x={COLS[0]} y={y} w={W[0]} h={146} color={k.c} p={p} pad="0 26px">
              <div style={{ height: 146, display: "flex", alignItems: "center", fontFamily: F.head, fontWeight: 500, fontSize: 30, color: k.c, lineHeight: 1.25 }}>{k.m}</div>
            </Panel>
            <div style={{ position: "absolute", left: COLS[1], top: y, width: W[1], height: 146, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 700, fontSize: 31, lineHeight: 1.36, color: C.text, opacity: clamp01(s(i + 1, 8)) }}>{k.what}</div>
            <div style={{ position: "absolute", left: COLS[2], top: y, width: W[2], height: 146, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 700, fontSize: 31, lineHeight: 1.36, color: C.dim, opacity: clamp01(s(i + 1, 14)) }}>{k.when}</div>
          </React.Fragment>
        );
      })}
    </Slide>
  );
};

/* What is not metaprogramming by itself */
const NOTS = [
  { t: "Рефлексія", d: "Засіб інтроспекції: читає відомості про програму, але не обов’язково генерує код.", c: C.violet },
  { t: "Декоратори, атрибути, анотації", d: "Метадані або обгортки. Метапрограмування з’являється, коли їх аналізують чи генерують за ними код.", c: C.amber },
  { t: "JIT-компіляція", d: "Оптимізація всередині середовища виконання, а не метапрограмування на рівні прикладної програми.", c: C.coral },
];

const NotMeta: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Що саме по собі ще не метапрограмування">
      {NOTS.map((n, i) => (
        <Panel key={n.t} x={96} y={220 + i * 220} w={1728} h={190} title={n.t} color={n.c} p={s(i + 1, 0, POP)}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 32, lineHeight: 1.38, color: C.text, marginTop: 6 }}>{n.d}</div>
        </Panel>
      ))}
    </Slide>
  );
};

/* Pipeline of working with a program */
const STAGES = [
  { t: "вихідний текст", c: C.dim },
  { t: "розпізнавання структури", c: C.teal },
  { t: "проміжне представлення", c: C.amber },
  { t: "аналіз чи перетворення", c: C.violet },
  { t: "генерація або виконання", c: C.coral },
];

const Stages: React.FC = () => {
  const { s, t } = useSteps();
  const X0 = 96;
  const BW = 312;
  const GAP = 42;
  const Y = 380;
  return (
    <Slide title="Етапи роботи з програмою">
      <Lead size={36}>У спрощеному вигляді програма проходить шлях від тексту до генерації чи виконання.</Lead>
      {STAGES.map((st, i) => {
        const x = X0 + i * (BW + GAP);
        const p = s(1, i * 10, POP);
        const hot = pulse(t(1, i * 10), 8, 20);
        return (
          <React.Fragment key={st.t}>
            <div style={{ position: "absolute", left: x, top: Y, width: BW, height: 150, borderRadius: 20, border: `3px solid ${st.c}`, background: `linear-gradient(180deg, ${st.c}26, ${st.c}0c), ${C.bg}`, boxShadow: hot > 0.05 ? `0 0 ${30 * hot}px ${st.c}` : undefined, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 18px", boxSizing: "border-box", fontFamily: F.body, fontWeight: 800, fontSize: 30, lineHeight: 1.3, color: C.text, opacity: clamp01(p), transform: `translateY(${(1 - p) * 20}px)` }}>
              {st.t}
            </div>
            {i > 0 && <Arrow x1={x - GAP + 6} y1={Y + 75} x2={x - 8} y2={Y + 75} step={1} delay={i * 10 - 4} color={C.dim} />}
          </React.Fragment>
        );
      })}
      <Arrow x1={X0 + 3 * (BW + GAP) + BW / 2} y1={680} x2={X0 + 3 * (BW + GAP) + BW / 2} y2={Y + 160} step={2} delay={10} color={C.violet} />
      <Panel x={X0 + 2 * (BW + GAP)} y={690} w={2 * BW + GAP} h={150} color={C.violet} p={s(2, 0, POP)} pad="18px 26px">
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.36, color: C.text }}>Рефлексія працює з метаданими вже скомпільованої програми.</div>
      </Panel>
      <Arrow x1={X0 + 4 * (BW + GAP) + BW / 2} y1={330} x2={X0 + 4 * (BW + GAP) + BW / 2} y2={Y - 10} step={3} delay={10} color={C.coral} />
      <At x={1104} y={262} w={720} step={3} size={28} weight={700} color={C.coral} align="right">
        генератор може брати дані з файлів конфігурації
      </At>
      <At x={96} y={890} w={1728} step={4} size={32} weight={700}>
        Не всі механізми проходять ці стадії в такому порядку. Тому важливіше розуміти <A>рівні й семантику</A>, ніж API конкретного компілятора.
      </At>
    </Slide>
  );
};

export const s1Slides: SlideDef[] = [
  { id: "definition", title: "Що таке метапрограмування", steps: [40, 40, 50, 60, 50], C: Definition },
  { id: "when", title: "Коли працює метапрограма", steps: [40, 90, 60], C: When },
  { id: "kinds", title: "Основні різновиди", steps: [30, 40, 40, 40, 40], C: Kinds },
  { id: "not-meta", title: "Що ще не метапрограмування", steps: [30, 40, 40, 40], C: NotMeta },
  { id: "stages", title: "Етапи роботи з програмою", steps: [40, 70, 50, 50, 50], C: Stages },
];
