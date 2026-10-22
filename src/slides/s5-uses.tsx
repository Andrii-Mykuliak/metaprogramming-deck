import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Num } from "./kit";

/* Applications */
const USES = [
  { t: "Генерація коду", items: ["серіалізація", "клієнтські API", "адаптери", "тестовий код", "схеми даних"], c: C.teal },
  { t: "Перевірка", items: ["інваріанти програмних конструкцій"], c: C.amber },
  { t: "Інструменти", items: ["рефакторинг", "статичний аналіз"], c: C.violet },
  { t: "Розширення мови", items: ["синтаксичні розширення"], c: C.coral },
];

const Uses: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Метапрограмування в інженерії ПЗ">
      <div style={{ position: "absolute", left: 96, top: 210, display: "flex", alignItems: "center", gap: 30, opacity: clamp01(s(0, 10, POP)) }}>
        <Chip color={C.blue} size={30} style={{ fontFamily: F.body }}>модель, метадані, програмна структура</Chip>
        <span style={{ fontFamily: F.mono, fontSize: 36, color: C.dim }}>→</span>
        <Chip color={C.teal} size={30} style={{ fontFamily: F.body }}>новий артефакт або рішення про допустимість коду</Chip>
      </div>
      {USES.map((u, i) => (
        <Panel key={u.t} x={96 + (i % 2) * 878} y={330 + Math.floor(i / 2) * 290} w={850} h={260} title={u.t} color={u.c} p={s(i + 1, 0, POP)}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
            {u.items.map((it, k) => (
              <Chip key={it} color={u.c} size={27} style={{ fontFamily: F.body, opacity: clamp01(s(i + 1, 8 + k * 4, POP)) }}>
                {it}
              </Chip>
            ))}
          </div>
        </Panel>
      ))}
    </Slide>
  );
};

/* Metaprogramming vs LLM code generation */
const CHECKS = ["коректність AST", "семантична еквівалентність", "відтворюваність", "інтеграція в компілятор"];

const Llm: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Метапрограмування і генерація коду LLM">
      <Lead size={34}>Між ними є частковий перетин, але це не одне й те саме.</Lead>
      <Panel x={96} y={290} w={850} h={420} title="Метапрограма" color={C.teal} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.text, marginTop: 8 }}>
          Працює зі структурою: деревом синтаксису, типами, метаданими. Результат визначений правилами перетворення.
        </div>
      </Panel>
      <Panel x={974} y={290} w={850} h={420} title="LLM" color={C.amber} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.text, marginTop: 8 }}>Породжує вихідний код як текст, що саме по собі не гарантує:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
          {CHECKS.map((c, i) => (
            <Chip key={c} color={C.coral} size={25} style={{ fontFamily: F.body, opacity: clamp01(s(2, 10 + i * 6, POP)) }}>
              {c}
            </Chip>
          ))}
        </div>
      </Panel>
      <At x={96} y={770} w={1728} step={3} size={34} weight={700}>
        Тому такий код потребує <A>перевірки типів</A>, <A>тестування</A> й <A>аналізу</A>.
      </At>
    </Slide>
  );
};

/* Declarative connection */
const PARADIGMS = [
  { t: "функційні", c: C.violet },
  { t: "логічні", c: C.amber },
  { t: "імперативні", c: C.coral },
];
const DECL = ["правила трансформації AST", "опис потрібних атрибутів", "специфікація серіалізованих типів"];

const Declarative: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Зв’язок із декларативним програмуванням">
      <Lead size={34}>
        Метапрограмування не є окремою формою декларативної парадигми: воно можливе в мовах різних парадигм.
      </Lead>
      <div style={{ position: "absolute", left: 96, top: 300, display: "flex", gap: 20 }}>
        {PARADIGMS.map((p, i) => (
          <Chip key={p.t} color={p.c} size={32} style={{ fontFamily: F.body, opacity: clamp01(s(1, i * 6, POP)) }}>
            {p.t}
          </Chip>
        ))}
      </div>
      <At x={96} y={420} w={1728} step={2} size={33} weight={700}>
        Водночас багато метапрограм мають виразну <A>декларативну структуру</A>:
      </At>
      {DECL.map((d, i) => (
        <Panel key={d} x={96 + i * 586} y={500} w={556} h={140} color={C.teal} p={s(2, 10 + i * 8, POP)} pad="0 26px">
          <div style={{ height: 140, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 800, fontSize: 30, lineHeight: 1.3, color: C.text }}>{d}</div>
        </Panel>
      ))}
      <At x={96} y={700} w={1728} step={3} size={33} weight={700}>
        Програміст задає властивості бажаного результату або правила перетворення, а інструмент будує реалізацію.
      </At>
      <At x={96} y={830} w={1728} step={4} size={31} weight={700} color={C.dim}>
        Для курсу це ще один рівень абстрагування: програма описує не лише обчислення над даними, а й створення інших обчислень.
      </At>
    </Slide>
  );
};

/* Risks */
const RISKS = [
  "Згенерований код буває складно читати й діагностувати; потрібні зрозумілі інструменти перевірки результату.",
  "Синтаксичні перетворення мають коректно враховувати зв’язування імен, області видимості й правила типізації.",
  "Генерація коду із зовнішніх даних вимагає перевірки довіри до них і захисту від небезпечних конструкцій.",
  "Перенесення роботи на компіляцію не усуває семантичних помилок, а лише змінює місце, де вони виникають.",
];

const Risks: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Межі та ризики">
      {RISKS.map((r, i) => (
        <Panel key={i} x={96} y={210 + i * 170} w={1728} h={146} color={C.coral} p={s(i + 1, 0, POP)} pad="0 30px">
          <div style={{ height: 146, display: "flex", alignItems: "center", fontFamily: F.body, fontWeight: 700, fontSize: 31, lineHeight: 1.36, color: C.text }}>{r}</div>
        </Panel>
      ))}
      <At x={96} y={900} w={1728} step={5} size={30} weight={700} color={C.dim}>
        Техніку варто обирати за проблемою, а не за технологічною новизною.
      </At>
    </Slide>
  );
};

/* Summary */
const POINTS = [
  "Метапрограма аналізує, створює або перетворює представлення програм: синтаксис, типи, метадані.",
  "AST робить програму даними, тому перетворення на кшталт згортання констант стають звичайними функціями над деревом.",
  "Макроси й генератори коду працюють під час компіляції; гігієнічність і стадії допомагають не зламати семантику.",
  "Рефлексія, дерева виразів і call/1 дають змогу досліджувати й виконувати програмні структури під час роботи.",
  "Метапрограмування варто оцінювати за тим, чи зменшує воно повторення й чи можна перевірити його результат.",
];

const Summary: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Підсумки">
      {POINTS.map((pt, i) => {
        const p = s(i + 1, 0);
        return (
          <div key={i} style={{ position: "absolute", left: 96, top: 214 + i * 156, width: 1728, display: "flex", gap: 30, alignItems: "flex-start", opacity: clamp01(p), transform: `translateX(${(1 - p) * -30}px)` }}>
            <Num n={i + 1} color={[C.teal, C.amber, C.violet, C.coral, C.blue][i]} size={60} />
            <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 34, lineHeight: 1.38, color: C.text, marginTop: 4 }}>{pt}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const s5Slides: SlideDef[] = [
  { id: "uses", title: "Застосування", steps: [40, 40, 40, 40, 40], C: Uses },
  { id: "llm", title: "Метапрограмування і LLM", steps: [30, 40, 60, 50], C: Llm },
  { id: "declarative", title: "Зв’язок із декларативним", steps: [40, 40, 60, 50, 50], C: Declarative },
  { id: "risks", title: "Межі та ризики", steps: [30, 40, 40, 40, 40, 50], C: Risks },
];

export const summarySlide: SlideDef = { id: "summary", title: "Підсумки", steps: [30, 40, 40, 40, 40, 40], C: Summary };


