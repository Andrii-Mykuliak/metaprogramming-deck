import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, clamp01, Lead, Panel, Slide } from "../deck/ui";

/* Macro vs function */
const MacroVsFn: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Макрос і функція">
      <Lead size={34}>
        <A>Макрос</A> задає перетворення синтаксичної форми ще до того, як програма потрапить до звичайного механізму виконання.
      </Lead>
      <div style={{ position: "absolute", left: 96, top: 290, opacity: clamp01(s(1, 0, POP)) }}>
        <Chip color={C.text} size={34} style={{ fontFamily: F.mono }}>
          (unless (&gt; 2 5) (displayln "Умова не виконується"))
        </Chip>
      </div>
      <Panel x={96} y={410} w={850} h={420} title="Якби unless була функцією" color={C.coral} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.38, color: C.text, marginTop: 8 }}>Функція отримує вже обчислені аргументи:</div>
        <div style={{ marginTop: 18, fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: 1.6, color: C.dim }}>
          <div style={{ opacity: clamp01(s(2, 10)) }}>1. (&gt; 2 5) → #f</div>
          <div style={{ opacity: clamp01(s(2, 22)) }}>
            2. (displayln …) → <span style={{ color: C.coral }}>друк одразу</span>
          </div>
          <div style={{ opacity: clamp01(s(2, 34)) }}>3. виклик unless</div>
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.coral, marginTop: 14, opacity: clamp01(s(2, 44)) }}>Тіло виконалося б за будь-якої умови.</div>
      </Panel>
      <Panel x={974} y={410} w={850} h={420} title="unless як макрос" color={C.teal} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.38, color: C.text, marginTop: 8 }}>Макрос отримує саму структуру виразів і переписує її:</div>
        <div style={{ marginTop: 22, fontFamily: F.mono, fontWeight: 700, fontSize: 28, lineHeight: 1.5, color: C.teal, opacity: clamp01(s(3, 14)) }}>
          (when (not (&gt; 2 5))
          <br />
          {"  (displayln …))"}
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 28, color: C.teal, marginTop: 20, opacity: clamp01(s(3, 30)) }}>Тіло виконується лише тоді, коли умова хибна.</div>
      </Panel>
      <At x={96} y={880} w={1728} step={4} size={32} weight={700}>
        Тому макроси будують <A>синтаксичні абстракції</A>, а не просто скорочують повторюваний текст.
      </At>
    </Slide>
  );
};

/* Racket macro and its expansion */
const Racket: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Макрос у Racket">
      <Code
        lang="rkt"
        x={96}
        y={200}
        size={36}
        step={0}
        delay={10}
        stagger={6}
        code={`
          #lang racket
          (define-syntax-rule [[1|(unless test body ...)]]
            [[2|(when (not test) body ...)]])

          @1+30 (unless (> 2 5)
          @1+34   (displayln "Умова не виконується"))
        `}
      />
      <Arrow x1={540} y1={600} x2={540} y2={680} step={2} delay={10} color={C.teal} />
      <At x={570} y={612} step={2} delay={10} size={28} weight={700} color={C.dim}>
        розгортання
      </At>
      <Code
        lang="rkt"
        x={96}
        y={700}
        size={36}
        step={2}
        delay={20}
        stagger={6}
        code={`
          (when (not (> 2 5))
            (displayln "Умова не виконується"))
        `}
      />
      <Panel x={1180} y={220} w={644} h={420} title="Що відбувається" color={C.teal} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.4, color: C.text, marginTop: 8 }}>
          Розширення відбувається на рівні синтаксису, а не після обчислення аргументів.
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.4, color: C.dim, marginTop: 18 }}>
          Синтаксичні об’єкти Racket пам’ятають зв’язування імен і походження фрагментів коду.
        </div>
      </Panel>
    </Slide>
  );
};

/* Hygiene: swap! and a user variable named tmp */
const Hygiene: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Гігієнічність макросів">
      <Lead size={34}>
        <A>Гігієнічність</A> не дає розгорнутому коду випадково захопити ідентифікатори, які написав користувач.
      </Lead>
      <Code
        lang="rkt"
        x={96}
        y={290}
        size={30}
        step={1}
        stagger={5}
        code={`
          (define-syntax-rule (swap! a b)
            (let ([[[2|tmp]] a]) (set! a b) (set! b [[2|tmp]])))

          @1+20 (define [[2@20|tmp]] 1)  (define y 2)
          @1+24 (swap! tmp y)
        `}
      />
      <Panel x={96} y={560} w={850} h={330} title="Негігієнічне розгортання" color={C.coral} p={s(2, 30, POP)}>
        <Code
          lang="rkt"
          x={0}
          y={0}
          size={27}
          step={2}
          delay={40}
          style={{ position: "relative", left: 0, top: 0, marginTop: 8 }}
          code={`
            (let ([tmp tmp])
              (set! tmp y) (set! y tmp))
          `}
        />
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, lineHeight: 1.38, color: C.coral, marginTop: 14, opacity: clamp01(s(2, 60)) }}>
          Внутрішній tmp затуляє змінну користувача: tmp = 1, y = 2, обміну немає.
        </div>
      </Panel>
      <Panel x={974} y={560} w={850} h={330} title="Гігієнічне розгортання" color={C.teal} p={s(3, 0, POP)}>
        <Code
          lang="rkt"
          x={0}
          y={0}
          size={27}
          step={3}
          delay={10}
          style={{ position: "relative", left: 0, top: 0, marginTop: 8 }}
          code={`
            (let ([tmp_1 tmp])
              (set! tmp y) (set! y tmp_1))
          `}
        />
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 27, lineHeight: 1.38, color: C.teal, marginTop: 14, opacity: clamp01(s(3, 30)) }}>
          Ім’я з макросу перейменовано: tmp = 2, y = 1.
        </div>
      </Panel>
      <At x={96} y={930} w={1728} step={4} size={29} weight={700} color={C.dim}>
        Гігієнічність не є автоматичною властивістю будь-якої макросистеми: документація Rust окремо попереджає про негігієнічність процедурних макросів.
      </At>
    </Slide>
  );
};

/* Rust macros */
const Rust: React.FC = () => {
  const { s, lin } = useSteps();
  const tokens = ["struct", "Point", "{", "x", ":", "f64", "}"];
  return (
    <Slide title="Макроси в Rust">
      <Panel x={96} y={210} w={850} h={290} title="Декларативні: macro_rules!" color={C.amber} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.text, marginTop: 8 }}>Правила зіставлення зі зразком: який фрагмент коду на який замінити.</div>
      </Panel>
      <Panel x={974} y={210} w={850} h={290} title="Процедурні макроси" color={C.violet} p={s(2, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, lineHeight: 1.4, color: C.text, marginTop: 8 }}>Функції над потоком токенів. Три види:</div>
        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          {["функціональноподібні", "атрибутні", "derive"].map((k, i) => (
            <Chip key={k} color={C.violet} size={24} style={{ fontFamily: F.body, opacity: clamp01(s(2, 10 + i * 6, POP)) }}>
              {k}
            </Chip>
          ))}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 96, top: 560, display: "flex", alignItems: "center", gap: 10 }}>
        {tokens.map((tk, i) => (
          <div key={i} style={{ padding: "8px 14px", borderRadius: 10, border: `2px solid ${C.blue}`, background: `${C.blue}18`, fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.blue, opacity: clamp01(s(3, i * 4, POP)) }}>
            {tk}
          </div>
        ))}
      </div>
      <At x={96} y={636} step={3} delay={20} size={26} weight={800} color={C.dim}>
        TokenStream на вході
      </At>
      <div style={{ position: "absolute", left: 830, top: 548, width: 300, height: 76, borderRadius: 18, border: `3px solid ${C.violet}`, background: `${C.violet}16`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 30, color: C.violet, opacity: clamp01(s(3, 30, POP)), boxShadow: `0 0 ${24 * Math.sin(Math.PI * lin(3, 40, 30))}px ${C.violet}` }}>
        #[derive(…)]
      </div>
      <Arrow x1={740} y1={586} x2={822} y2={586} step={3} delay={26} color={C.dim} />
      <Arrow x1={1140} y1={586} x2={1222} y2={586} step={3} delay={60} color={C.dim} />
      <div style={{ position: "absolute", left: 1236, top: 548, padding: "14px 22px", borderRadius: 12, border: `2px solid ${C.teal}`, background: `${C.teal}14`, fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.teal, opacity: clamp01(s(3, 66, POP)) }}>
        impl Debug for Point {"{ … }"}
      </div>
      <At x={1236} y={636} step={3} delay={70} size={26} weight={800} color={C.dim}>
        TokenStream на виході
      </At>
      <At x={96} y={760} w={1728} step={4} size={33} weight={700}>
        Тож не варто казати, що процедурний макрос Rust безпосередньо отримує AST: його стабільний інтерфейс побудовано навколо <A c={C.blue}>TokenStream</A>.
      </At>
    </Slide>
  );
};

/* Multi-stage programming */
const MultiStage: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Багатостадійне програмування">
      <Lead size={34}>Під час компіляції важливо розрізняти програму, що генерує код, і код, який вона породжує.</Lead>
      <Panel x={96} y={310} w={600} h={240} title="Стадія 1: генератор" color={C.violet} p={s(1, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>працює під час збірки й будує код</div>
      </Panel>
      <Arrow x1={710} y1={430} x2={900} y2={430} step={2} color={C.dim} />
      <Panel x={914} y={310} w={600} h={240} title="Стадія 2: згенерований код" color={C.teal} p={s(2, 10, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>працює під час виконання програми</div>
      </Panel>
      <Panel x={96} y={610} w={850} h={240} title="Виграш" color={C.teal} p={s(3, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>менше повторень; частина роботи переноситься на етап збірки</div>
      </Panel>
      <Panel x={974} y={610} w={850} h={240} title="Ціна" color={C.coral} p={s(4, 0, POP)}>
        <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 29, lineHeight: 1.38, color: C.text, marginTop: 8 }}>складніше відлагоджувати згенерований код і читати повідомлення про помилки</div>
      </Panel>
    </Slide>
  );
};

/* Roslyn source generators */
const Roslyn: React.FC = () => {
  const { s } = useSteps();
  const box = (x: number, y: number, w: number, label: string, color: string, p: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 84, borderRadius: 18, border: `3px solid ${color}`, background: `linear-gradient(180deg, ${color}26, ${color}0c), ${C.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontWeight: 800, fontSize: 27, color: C.text, opacity: clamp01(p), textAlign: "center", padding: "0 14px", boxSizing: "border-box" }}>
      {label}
    </div>
  );
  return (
    <Slide title="Генератори вихідного коду в C#">
      <Lead size={33}>
        <A>Roslyn Source Generators</A> аналізують інформацію компіляції та додаткові файли й додають до компіляції нові вихідні тексти.
      </Lead>
      {box(96, 300, 360, "інформація компіляції", C.blue, s(1, 0, POP))}
      {box(96, 410, 360, "додаткові файли", C.blue, s(1, 6, POP))}
      <Arrow x1={466} y1={342} x2={600} y2={392} step={1} delay={14} color={C.dim} />
      <Arrow x1={466} y1={452} x2={600} y2={402} step={1} delay={14} color={C.dim} />
      {box(610, 355, 300, "генератор", C.violet, s(1, 20, POP))}
      <Arrow x1={920} y1={397} x2={1040} y2={397} step={1} delay={30} color={C.dim} />
      {box(1050, 355, 340, "+ новий файл .g.cs", C.teal, s(1, 36, POP))}
      {box(1430, 300, 394, "код користувача", C.dim, s(1, 40, POP))}
      <At x={1430} y={400} w={394} step={1} delay={44} size={25} weight={700} color={C.dim} align="center">
        не переписується
      </At>
      <Code
        lang="cs"
        x={96}
        y={560}
        size={27}
        step={2}
        stagger={5}
        code={`
          public sealed record Measurement(int SensorId, double Value);

          [[3|[JsonSerializable(typeof(Measurement))]]]
          internal partial class MeasurementJsonContext : JsonSerializerContext
          {
          }
          // генератор формує реалізацію контексту
          // MeasurementJsonContext.Default.Measurement
        `}
      />
      <At x={96} y={960} w={1728} step={4} size={28} weight={700} color={C.dim}>
        Тут метапрограмування не змінює алгоритм під час роботи, а заздалегідь готує його частину.
      </At>
    </Slide>
  );
};

/* Attribute is not a metaprogram */
const Attribute: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Атрибут – ще не метапрограма">
      <div style={{ position: "absolute", left: 96, top: 300, opacity: clamp01(s(1, 0, POP)) }}>
        <Chip color={C.amber} size={40}>[JsonSerializable]</Chip>
      </div>
      <At x={96} y={400} w={760} step={1} delay={10} size={32} weight={700}>
        Атрибут лише <A c={C.amber}>позначає</A>, для якого типу потрібна реалізація.
      </At>
      <Arrow x1={720} y1={330} x2={1000} y2={330} step={2} color={C.dim} />
      <div style={{ position: "absolute", left: 1010, top: 286, width: 360, height: 90, borderRadius: 18, border: `3px solid ${C.violet}`, background: `${C.violet}16`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontWeight: 800, fontSize: 30, color: C.text, opacity: clamp01(s(2, 10, POP)) }}>
        окремий інструмент
      </div>
      <At x={1010} y={400} w={814} step={2} delay={16} size={32} weight={700}>
        Генерацію виконує інструмент, який <A c={C.violet}>інтерпретує</A> ці метадані.
      </At>
      <At x={96} y={640} w={1728} step={3} size={36} weight={700}>
        Так само атрибути й анотації інших мов лише створюють умови для автоматизації, але не тотожні метапрограмі.
      </At>
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "macro-vs-fn", title: "Макрос і функція", steps: [40, 30, 60, 50, 50], C: MacroVsFn },
  { id: "racket", title: "Макрос у Racket", steps: [50, 60, 60, 50], C: Racket },
  { id: "hygiene", title: "Гігієнічність", steps: [40, 50, 80, 50, 50], C: Hygiene },
  { id: "rust", title: "Макроси в Rust", steps: [30, 40, 50, 100, 50], C: Rust },
  { id: "multistage", title: "Багатостадійне програмування", steps: [40, 40, 50, 40, 40], C: MultiStage },
  { id: "roslyn", title: "Генератори коду в C#", steps: [40, 70, 60, 40, 50], C: Roslyn },
  { id: "attribute", title: "Атрибут і генератор", steps: [30, 40, 50, 50], C: Attribute },
];
