import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";
import { Edge, TreeNode } from "./intro";

/* Reflection */
const PROPS = [
  ["SensorId", "Int32"],
  ["Value", "Double"],
];

const Reflection: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Рефлексія">
      <Lead size={34}>
        <A>Рефлексія</A> дає відомості про типи й інші елементи програми під час її роботи. Часто це лише аналіз метаданих.
      </Lead>
      <Code
        lang="cs"
        x={96}
        y={300}
        size={30}
        step={1}
        stagger={5}
        code={`
          using System;
          using System.Reflection;

          Type t = typeof(Measurement);
          foreach (PropertyInfo property in t.GetProperties())
              Console.WriteLine($"{property.Name}: {property.PropertyType.Name}");
        `}
      />
      <Panel x={96} y={620} w={560} h={190} title="Вивід" color={C.teal} p={s(2, 0, POP)}>
        {PROPS.map(([n, ty], i) => (
          <div key={n} style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.text, marginTop: i ? 6 : 10, opacity: clamp01(s(2, 10 + i * 10)) }}>
            {n}: <span style={{ color: C.teal }}>{ty}</span>
          </div>
        ))}
      </Panel>
      <Panel x={700} y={620} w={1124} h={190} title="Інтроспекція" color={C.violet} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, lineHeight: 1.38, color: C.text, marginTop: 6 }}>
          Програма не створює нового типу й не змінює його визначення, але може будувати універсальні інструменти: відображення, перевірку, серіалізацію.
        </div>
      </Panel>
      <At x={96} y={860} w={1728} step={4} size={31} weight={700}>
        Надмірна рефлексія ускладнює <A c={C.coral}>статичний аналіз</A> і відкладає виявлення помилок до виконання.
      </At>
    </Slide>
  );
};

/* Expression trees */
const ExprTree: React.FC = () => {
  const { s } = useSteps();
  const tree = s(2, 0);
  const L = { x: 1380, y: 330 };
  const G = { x: 1380, y: 480 };
  const P = { x: 1220, y: 630 };
  const K = { x: 1540, y: 630 };
  return (
    <Slide title="Дерева виразів у C#">
      <Lead size={34} w={1100}>
        <A>Expression&lt;TDelegate&gt;</A> представляє лямбда-вираз як структуру даних, а не лише як виконуваний делегат.
      </Lead>
      <Code
        lang="cs"
        x={96}
        y={400}
        size={27}
        step={1}
        stagger={6}
        code={`
          Expression<Func<int, bool>> predicate = x => x > 10;
          @3 Console.WriteLine(predicate.Body.NodeType);  // GreaterThan
          @4 Func<int, bool> compiled = predicate.Compile();
          @4+8 Console.WriteLine(compiled(15));              // True
        `}
      />
      <Edge x1={L.x} y1={L.y} x2={G.x} y2={G.y} p={tree} />
      <Edge x1={G.x} y1={G.y} x2={P.x} y2={P.y} p={tree} />
      <Edge x1={G.x} y1={G.y} x2={K.x} y2={K.y} p={tree} />
      <TreeNode x={L.x} y={L.y} label="Lambda x" color={C.violet} p={s(2, 4, POP)} w={200} size={28} />
      <TreeNode x={G.x} y={G.y} label="GreaterThan" color={C.amber} p={s(2, 10, POP)} w={230} size={28} glow={s(3, 0) * (1 - s(3, 30))} />
      <TreeNode x={P.x} y={P.y} label="Parameter x" color={C.teal} p={s(2, 16, POP)} w={230} size={26} />
      <TreeNode x={K.x} y={K.y} label="Constant 10" color={C.teal} p={s(2, 20, POP)} w={230} size={26} />
      <At x={96} y={720} w={1728} step={4} delay={20} size={32} weight={700}>
        Дерево можна дослідити, передати іншому компоненту для інтерпретації чи трансляції, а можна <A>скомпілювати</A> у звичайну функцію.
      </At>
      <At x={96} y={850} w={1728} step={5} size={32} weight={700} color={C.dim}>
        Це поєднання функційного запису й метапрограмування: лямбда-вираз стає даними для наступного етапу.
      </At>
    </Slide>
  );
};

/* IQueryable translation */
const Translate: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Трансляція дерев виразів">
      <Lead size={34}>Провайдери запитів на основі IQueryable отримують дерево виразу й транслюють його у запит до зовнішнього джерела.</Lead>
      <div style={{ position: "absolute", left: 96, top: 320, opacity: clamp01(s(1, 0, POP)) }}>
        <Chip color={C.text} size={34}>orders.Where(o =&gt; o.Total &gt; 10)</Chip>
      </div>
      <Arrow x1={820} y1={354} x2={1000} y2={354} step={1} delay={14} color={C.dim} />
      <div style={{ position: "absolute", left: 1010, top: 320, opacity: clamp01(s(1, 24, POP)) }}>
        <Chip color={C.teal} size={34}>WHERE Total &gt; 10</Chip>
      </div>
      <div style={{ position: "absolute", left: 96, top: 480, opacity: clamp01(s(2, 0, POP)) }}>
        <Chip color={C.text} size={34}>orders.Where(o =&gt; IsVip(o))</Chip>
      </div>
      <Arrow x1={760} y1={514} x2={1000} y2={514} step={2} delay={14} color={C.coral} />
      <div style={{ position: "absolute", left: 1010, top: 480, opacity: clamp01(s(2, 24, POP)) }}>
        <Chip color={C.coral} size={34}>метод невідомий провайдеру</Chip>
      </div>
      <At x={96} y={660} w={1728} step={3} size={36} weight={700}>
        Не кожен довільний метод чи вираз C# автоматично піддається такій трансляції: провайдер розуміє лише підтримувані частини дерева.
      </At>
    </Slide>
  );
};

/* Prolog call/1 */
const PrologCall: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Мета-виклики в Prolog">
      <Lead size={34}>
        У Prolog терм може представляти ціль програми. Предикат <A>call/1</A> виконує ціль, яку передали як дані.
      </Lead>
      <Code
        lang="pl"
        x={96}
        y={300}
        size={36}
        step={1}
        stagger={6}
        code={`
          parent(anna, bob).
          parent(bob, clara).

          check(Goal) :- [[2|call(Goal)]].

          @3 ?- check([[3@10|parent(anna, X)]]).
          @3+30 X = bob.
        `}
      />
      <Panel x={1060} y={300} w={764} h={250} title="Терм як структура" color={C.amber} p={s(3, 20, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>
          parent(anna, X) – не текст, а структура, яку Prolog може виконати як ціль.
        </div>
      </Panel>
      <Panel x={1060} y={590} w={764} h={250} title="Не плутати" color={C.coral} p={s(4, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>
          call/1 не змінює бази правил. Зміна бази фактів – окрема можливість мови.
        </div>
      </Panel>
    </Slide>
  );
};

export const s4Slides: SlideDef[] = [
  { id: "reflection", title: "Рефлексія", steps: [40, 50, 50, 40, 50], C: Reflection },
  { id: "expr-tree", title: "Дерева виразів", steps: [40, 40, 50, 60, 60, 50], C: ExprTree },
  { id: "translate", title: "Трансляція запитів", steps: [40, 50, 50, 50], C: Translate },
  { id: "prolog-call", title: "call/1 у Prolog", steps: [40, 50, 40, 70, 50], C: PrologCall },
];
