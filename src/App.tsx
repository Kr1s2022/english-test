import { useState } from "react";

// ─── Exercise Types ────────────────────────────────────────────────────────────

interface ExerciseTypePicture {
  kind: "picture";
  id: number;
  title: string;
  pictureSrc: string;
  paragraphHtml: string;
  questions: { id: number; correctAnswers: string[] }[];
}

interface ExerciseTypeTranslate {
  kind: "translate";
  id: number;
  title: string;
  questions: { id: number; russianSentence: string; correctAnswers: string[] }[];
}

interface ExerciseTypeWrite {
  kind: "write";
  id: number;
  title: string;
  subtitle: string;
  questions: { id: number; prompt: string; correctAnswers: string[] }[];
}

interface ExerciseTypeChooseVerb {
  kind: "chooseVerb";
  id: number;
  title: string;
  questions: { id: number; sentence: string; correctAnswers: string[] }[];
}

interface ExerciseTypeFillBlanks {
  kind: "fillBlanks";
  id: number;
  title: string;
  paragraphHtml: string;
  questions: { id: number; correctAnswers: string[] }[];
}

type Exercise =
  | ExerciseTypePicture
  | ExerciseTypeTranslate
  | ExerciseTypeWrite
  | ExerciseTypeChooseVerb
  | ExerciseTypeFillBlanks;

// ─── Data ─────────────────────────────────────────────────────────────────────

const exercises: Exercise[] = [
  {
    kind: "picture",
    id: 1,
    title: "Посмотри на картинку, прочитай и заполни пропуски.",
    pictureSrc: "/images/beach.jpg",
    paragraphHtml: `The family is at the beach today. Look! Everybody <strong>e.g. is having</strong> (have) a great time! Roy and Tom 1) ………………… (play) volleyball. Little Rick 2) ………………… (sleep). Their mother, Wendy, 3) ………………… (read) a book under the big umbrella. Their father, Jim, 4) ………………… (enjoy) the sun and the dog 5) ………………… (run) along the beach`,
    questions: [
      { id: 1, correctAnswers: ["are playing", "Are playing"] },
      { id: 2, correctAnswers: ["is sleeping", "Is sleeping"] },
      { id: 3, correctAnswers: ["is reading", "Is reading"] },
      { id: 4, correctAnswers: ["is enjoying", "Is enjoying"] },
      { id: 5, correctAnswers: ["is running", "Is running"] },
    ],
  },
  {
    kind: "translate",
    id: 2,
    title: "Переведи предложения.",
    questions: [
      { id: 1, russianSentence: "Он пьет колу.", correctAnswers: ["He is drinking a Coke.", "He is drinking Coke.", "He is drinking cola.", "He is drinking a cola."] },
      { id: 2, russianSentence: "Мы играем в игру.", correctAnswers: ["We are playing a game.", "We are playing the game."] },
      { id: 3, russianSentence: "Я катаюсь на машине.", correctAnswers: ["I am riding a car.", "I am driving a car.", "I'm riding a car.", "I'm driving a car."] },
      { id: 4, russianSentence: "Она читает книгу.", correctAnswers: ["She is reading a book.", "She is reading the book."] },
      { id: 5, russianSentence: "Они бегут по парку.", correctAnswers: ["They are running in the park.", "They are running through the park.", "They are running around the park."] },
    ],
  },
  {
    kind: "write",
    id: 3,
    title: "Напиши, что делают дети.",
    subtitle: "В ответах напишите полные предложения.",
    questions: [
      { id: 1, prompt: "Anna ... (wear) a mac.", correctAnswers: ["Anna is wearing a mac.", "Anna is wearing a Mac."] },
      { id: 2, prompt: "Ben ... (ride) a bike.", correctAnswers: ["Ben is riding a bike."] },
      { id: 3, prompt: "Tim and Dan ... (play) basketball.", correctAnswers: ["Tim and Dan are playing basketball.", "Tim and dan are playing basketball."] },
      { id: 4, prompt: "Sue and her sister (drink) Coke.", correctAnswers: ["Sue and her sister are drinking Coke.", "Sue and her sister is drinking Coke."] },
      { id: 5, prompt: "Mike (sleep).", correctAnswers: ["Mike is sleeping."] },
    ],
  },
  {
    kind: "chooseVerb",
    id: 4,
    title: "Выбери нужный глагол: am, is, are.",
    questions: [
      { id: 1, sentence: "The baby ___ sleeping.", correctAnswers: ["is", "Is"] },
      { id: 2, sentence: "I ___ wearing a mac.", correctAnswers: ["am", "Am"] },
      { id: 3, sentence: "___ you painting your face?", correctAnswers: ["are", "Are"] },
      { id: 4, sentence: "Mum and Dad ___ not eating hot dogs.", correctAnswers: ["are", "Are"] },
      { id: 5, sentence: "___ your sister making a sandcastle?", correctAnswers: ["is", "Is"] },
    ],
  },
  {
    kind: "fillBlanks",
    id: 5,
    title: "Прочитай и заполни пропуски.",
    paragraphHtml: `It is a holiday at the farm. The farmer 1) ………………… (feed) the chickens. His wife 2) ………………… (pick) vegetables. The children 3) ………………… (chase) the sheep. The dog 4) ………………… (bark) at a stranger. The sun 5) ………………… (set) behind the hills.`,
    questions: [
      { id: 1, correctAnswers: ["is feeding", "Is feeding"] },
      { id: 2, correctAnswers: ["is picking", "Is picking"] },
      { id: 3, correctAnswers: ["are chasing", "Are chasing"] },
      { id: 4, correctAnswers: ["is barking", "Is barking"] },
      { id: 5, correctAnswers: ["is setting", "Is setting"] },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
type AnswerState = "idle" | "correct" | "incorrect" | "empty";

function checkAnswer(value: string, correctAnswers: string[]): AnswerState {
  if (!value.trim()) return "idle";
  const normalized = value.trim().toLowerCase();
  return correctAnswers.some((a) => a.toLowerCase() === normalized)
    ? "correct"
    : "incorrect";
}

function inputBorderClass(state: AnswerState, showEmptyError: boolean, isEmpty: boolean) {
  if (state === "correct") return "border-green-500 focus:ring-green-300";
  if (state === "incorrect") return "border-red-500 focus:ring-red-300";
  if (showEmptyError && isEmpty) return "border-amber-400 focus:ring-amber-200";
  return "border-orange-400 focus:ring-orange-200";
}

function inputBgClass(state: AnswerState, showEmptyError: boolean, isEmpty: boolean) {
  if (state === "correct") return "bg-green-50";
  if (state === "incorrect") return "bg-red-50";
  if (showEmptyError && isEmpty) return "bg-amber-50";
  return "bg-white";
}

// ─── Shared Answer Input ───────────────────────────────────────────────────────
function AnswerInput({
  label,
  value,
  onChange,
  state,
  correctAnswers,
  submitted,
  showEmptyError,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  state: AnswerState;
  correctAnswers: string[];
  submitted: boolean;
  showEmptyError: boolean;
}) {
  const isEmpty = !value.trim();
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-sm text-gray-600">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted}
        className={`w-full rounded border-2 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:ring-2 ${inputBorderClass(state, showEmptyError, isEmpty)} ${inputBgClass(state, showEmptyError, isEmpty)}`}
      />
      {submitted && state === "incorrect" && (
        <p className="mt-1 text-xs text-gray-500">
          Правильные ответы: {correctAnswers.join(", ")}
        </p>
      )}
      {submitted && state === "correct" && (
        <p className="mt-1 text-xs text-green-600 font-medium">✓ Верно!</p>
      )}
      {!submitted && showEmptyError && isEmpty && (
        <p className="mt-1 text-xs text-amber-600 font-medium">⚠ Заполните это поле</p>
      )}
    </div>
  );
}

// ─── Exercise 1: Picture fill-in ──────────────────────────────────────────────
function PictureExercise({
  exercise, answers, setAnswer, submitted, showEmptyError,
}: {
  exercise: ExerciseTypePicture;
  answers: Record<number, string>;
  setAnswer: (id: number, v: string) => void;
  submitted: boolean;
  showEmptyError: boolean;
}) {
  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-3 font-semibold text-sm text-gray-700" style={{ backgroundColor: "#fdf3e3", borderBottom: "1px solid #e5e7eb" }}>
          Picture
        </div>
        <div className="p-5 flex flex-col sm:flex-row gap-5 items-start">
          <img src={exercise.pictureSrc} alt="Exercise picture" className="w-60 flex-shrink-0 rounded object-cover border border-gray-200" />
          <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: exercise.paragraphHtml }} />
        </div>
      </div>
      <div className="border-t border-gray-300" />
      <div className="bg-white border border-t-0 border-gray-200 shadow-sm px-5 pt-2 pb-6">
        {exercise.questions.map((q) => {
          const val = answers[q.id] ?? "";
          const state: AnswerState = submitted ? checkAnswer(val, q.correctAnswers) : "idle";
          return (
            <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 pt-4">
              <div className="mb-3 rounded-sm px-4 py-2" style={{ backgroundColor: "#fdf3e3" }}>
                <span className="text-base font-semibold text-gray-700">{q.id}</span>
              </div>
              <AnswerInput label="Впишите ответ:" value={val} onChange={(v) => setAnswer(q.id, v)} state={state} correctAnswers={q.correctAnswers} submitted={submitted} showEmptyError={showEmptyError} />
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Exercise 2: Translate ─────────────────────────────────────────────────────
function TranslateExercise({
  exercise, answers, setAnswer, submitted, showEmptyError,
}: {
  exercise: ExerciseTypeTranslate;
  answers: Record<number, string>;
  setAnswer: (id: number, v: string) => void;
  submitted: boolean;
  showEmptyError: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm px-5 pt-2 pb-6">
      {exercise.questions.map((q) => {
        const val = answers[q.id] ?? "";
        const state: AnswerState = submitted ? checkAnswer(val, q.correctAnswers) : "idle";
        return (
          <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 pt-4">
            <div className="mb-3 rounded-sm px-4 py-2.5" style={{ backgroundColor: "#fdf3e3", borderLeft: "4px solid #f59e0b" }}>
              <span className="text-sm font-semibold text-gray-800">{q.russianSentence}</span>
            </div>
            <AnswerInput label="Впишите ответ:" value={val} onChange={(v) => setAnswer(q.id, v)} state={state} correctAnswers={q.correctAnswers} submitted={submitted} showEmptyError={showEmptyError} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Exercise 3: Write full sentences ─────────────────────────────────────────
function WriteExercise({
  exercise, answers, setAnswer, submitted, showEmptyError,
}: {
  exercise: ExerciseTypeWrite;
  answers: Record<number, string>;
  setAnswer: (id: number, v: string) => void;
  submitted: boolean;
  showEmptyError: boolean;
}) {
  return (
    <>
      {exercise.subtitle && (
        <div className="bg-white border border-gray-200 border-b-0 px-5 pt-4 pb-0">
          <p className="text-sm text-gray-600 italic">{exercise.subtitle}</p>
        </div>
      )}
      <div className="bg-white border border-gray-200 shadow-sm px-5 pt-2 pb-6">
        {exercise.questions.map((q) => {
          const val = answers[q.id] ?? "";
          const state: AnswerState = submitted ? checkAnswer(val, q.correctAnswers) : "idle";
          return (
            <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 pt-4">
              <div className="mb-3 rounded-sm px-4 py-2.5" style={{ backgroundColor: "#fdf3e3", borderLeft: "4px solid #f59e0b" }}>
                <span className="text-sm font-semibold text-amber-700">{q.prompt}</span>
              </div>
              <AnswerInput label="Впишите ответ:" value={val} onChange={(v) => setAnswer(q.id, v)} state={state} correctAnswers={q.correctAnswers} submitted={submitted} showEmptyError={showEmptyError} />
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Exercise 4: Choose am/is/are (buttons) ───────────────────────────────────
function ChooseVerbExercise({
  exercise, verbSelections, selectVerb, submitted, showEmptyError,
}: {
  exercise: ExerciseTypeChooseVerb;
  verbSelections: Record<number, string>;
  selectVerb: (id: number, v: string) => void;
  submitted: boolean;
  showEmptyError: boolean;
}) {
  const verbs = ["am", "is", "are"];
  return (
    <div className="bg-white border border-gray-200 shadow-sm px-5 pt-2 pb-6">
      {exercise.questions.map((q) => {
        const sel = verbSelections[q.id] ?? "";
        const isEmpty = !sel;
        const st: AnswerState = submitted && sel ? checkAnswer(sel, q.correctAnswers) : "idle";
        return (
          <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 pt-4">
            <div className="mb-3 rounded-sm px-4 py-2.5" style={{ backgroundColor: "#fdf3e3", borderLeft: "4px solid #f59e0b" }}>
              <span className="text-sm font-semibold text-amber-700">{q.sentence}</span>
            </div>
            <div className="flex gap-3 mt-3">
              {verbs.map((v) => {
                let btnClass = "px-6 py-2 rounded-lg border-2 text-sm font-semibold transition ";
                if (sel === v) {
                  if (!submitted) btnClass += "border-orange-400 bg-orange-50 text-orange-700";
                  else if (st === "correct") btnClass += "border-green-500 bg-green-50 text-green-700";
                  else btnClass += "border-red-500 bg-red-50 text-red-700";
                } else if (!submitted && showEmptyError && isEmpty) {
                  btnClass += "border-amber-400 bg-amber-50 text-amber-700";
                } else {
                  btnClass += "border-gray-300 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600";
                }
                if (submitted) btnClass += " cursor-not-allowed opacity-80";
                return (
                  <button key={v} onClick={() => !submitted && selectVerb(q.id, v)} disabled={submitted} className={btnClass}>
                    {v}
                  </button>
                );
              })}
            </div>
            {submitted && sel && st === "incorrect" && <p className="mt-1 text-xs text-gray-500">Правильно: {q.correctAnswers[0]}</p>}
            {submitted && sel && st === "correct" && <p className="mt-1 text-xs text-green-600 font-medium">✓ Верно!</p>}
            {!submitted && showEmptyError && isEmpty && <p className="mt-1 text-xs text-amber-600 font-medium">⚠ Выберите вариант</p>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Exercise 5: Fill blanks (no picture) ─────────────────────────────────────
function FillBlanksExercise({
  exercise, answers, setAnswer, submitted, showEmptyError,
}: {
  exercise: ExerciseTypeFillBlanks;
  answers: Record<number, string>;
  setAnswer: (id: number, v: string) => void;
  submitted: boolean;
  showEmptyError: boolean;
}) {
  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="px-5 py-3 font-semibold text-sm text-gray-700" style={{ backgroundColor: "#fdf3e3", borderBottom: "1px solid #e5e7eb" }}>
          Текст
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: exercise.paragraphHtml }} />
        </div>
      </div>
      <div className="border-t border-gray-300" />
      <div className="bg-white border border-t-0 border-gray-200 shadow-sm px-5 pt-2 pb-6">
        {exercise.questions.map((q) => {
          const val = answers[q.id] ?? "";
          const state: AnswerState = submitted ? checkAnswer(val, q.correctAnswers) : "idle";
          return (
            <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0 pt-4">
              <div className="mb-3 rounded-sm px-4 py-2" style={{ backgroundColor: "#fdf3e3" }}>
                <span className="text-base font-semibold text-gray-700">{q.id}</span>
              </div>
              <AnswerInput label="Впишите ответ:" value={val} onChange={(v) => setAnswer(q.id, v)} state={state} correctAnswers={q.correctAnswers} submitted={submitted} showEmptyError={showEmptyError} />
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [exerciseIndex, setExerciseIndex] = useState(0);

  const [allAnswers, setAllAnswers] = useState<Record<number, Record<number, string>>>(() => {
    const init: Record<number, Record<number, string>> = {};
    exercises.forEach((ex) => {
      init[ex.id] = {};
      ex.questions.forEach((q) => { init[ex.id][q.id] = ""; });
    });
    return init;
  });

  const [verbSelections, setVerbSelections] = useState<Record<number, Record<number, string>>>(() => {
    const init: Record<number, Record<number, string>> = {};
    exercises.forEach((ex) => { init[ex.id] = {}; });
    return init;
  });

  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [showEmptyErrors, setShowEmptyErrors] = useState<Record<number, boolean>>({});
  const [showResult, setShowResult] = useState(false);

  const exercise = exercises[exerciseIndex];
  const totalExercises = exercises.length;
  const answers = allAnswers[exercise.id];
  const isSubmitted = submitted[exercise.id] ?? false;
  const showEmptyError = showEmptyErrors[exercise.id] ?? false;

  function hasEmptyAnswers(): boolean {
    if (exercise.kind === "chooseVerb") {
      return exercise.questions.some((q) => !verbSelections[exercise.id]?.[q.id]);
    }
    return exercise.questions.some((q) => !(allAnswers[exercise.id]?.[q.id] ?? "").trim());
  }

  function setAnswer(qId: number, value: string) {
    setAllAnswers((prev) => ({
      ...prev,
      [exercise.id]: { ...prev[exercise.id], [qId]: value },
    }));
    // clear empty error for this exercise once all filled
    if (showEmptyError) {
      const updatedAnswers = { ...allAnswers[exercise.id], [qId]: value };
      const allFilled = exercise.questions.every((q) => (updatedAnswers[q.id] ?? "").trim());
      if (allFilled) setShowEmptyErrors((prev) => ({ ...prev, [exercise.id]: false }));
    }
  }

  function selectVerb(qId: number, value: string) {
    setVerbSelections((prev) => ({
      ...prev,
      [exercise.id]: { ...prev[exercise.id], [qId]: value },
    }));
    if (showEmptyError) {
      const updated = { ...verbSelections[exercise.id], [qId]: value };
      const allFilled = exercise.questions.every((q) => updated[q.id]);
      if (allFilled) setShowEmptyErrors((prev) => ({ ...prev, [exercise.id]: false }));
    }
  }

  function handleCheck() {
    if (hasEmptyAnswers()) {
      setShowEmptyErrors((prev) => ({ ...prev, [exercise.id]: true }));
      return;
    }
    setSubmitted((prev) => ({ ...prev, [exercise.id]: true }));
    setShowEmptyErrors((prev) => ({ ...prev, [exercise.id]: false }));
  }

  function handleNext() {
    if (exerciseIndex < totalExercises - 1) {
      setExerciseIndex(exerciseIndex + 1);
    } else {
      setShowResult(true);
    }
  }

  function handlePrev() {
    if (exerciseIndex > 0) setExerciseIndex(exerciseIndex - 1);
  }

  function handleReset() {
    const init: Record<number, Record<number, string>> = {};
    exercises.forEach((ex) => {
      init[ex.id] = {};
      ex.questions.forEach((q) => { init[ex.id][q.id] = ""; });
    });
    setAllAnswers(init);
    setVerbSelections(() => {
      const v: Record<number, Record<number, string>> = {};
      exercises.forEach((ex) => { v[ex.id] = {}; });
      return v;
    });
    setSubmitted({});
    setShowEmptyErrors({});
    setExerciseIndex(0);
    setShowResult(false);
  }

  function calculateScore() {
    let correct = 0, total = 0;
    exercises.forEach((ex) => {
      ex.questions.forEach((q) => {
        total++;
        const val = ex.kind === "chooseVerb"
          ? (verbSelections[ex.id]?.[q.id] ?? "")
          : (allAnswers[ex.id]?.[q.id] ?? "");
        if (checkAnswer(val, q.correctAnswers) === "correct") correct++;
      });
    });
    return { correct, total };
  }

  // ── Result screen ──────────────────────────────────────────────────────────
  if (showResult) {
    const { correct, total } = calculateScore();
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center space-y-6">
          <div className="text-5xl">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚"}</div>
          <h2 className="text-2xl font-bold text-gray-800">Тест завершён!</h2>
          <div className="text-gray-600 text-lg">
            Правильных ответов:{" "}
            <span className="font-bold text-orange-500">{correct} / {total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? "#22c55e" : pct >= 50 ? "#f97316" : "#ef4444" }} />
          </div>
          <p className="text-gray-500 text-sm">{pct}% правильно</p>
          <button onClick={handleReset} className="mt-4 px-6 py-3 rounded-lg text-white font-semibold transition hover:opacity-90" style={{ backgroundColor: "#f97316" }}>
            Пройти снова
          </button>
        </div>
      </div>
    );
  }

  // ── Exercise screen ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between px-5 py-4 rounded-t-md" style={{ backgroundColor: "#1e293b" }}>
          <span className="text-base font-medium text-white tracking-wide">{exercise.title}</span>
          <span className="text-sm font-semibold text-white whitespace-nowrap ml-4">{exerciseIndex + 1}/{totalExercises}</span>
        </div>

        {exercise.kind === "picture" && <PictureExercise exercise={exercise} answers={answers} setAnswer={setAnswer} submitted={isSubmitted} showEmptyError={showEmptyError} />}
        {exercise.kind === "translate" && <TranslateExercise exercise={exercise} answers={answers} setAnswer={setAnswer} submitted={isSubmitted} showEmptyError={showEmptyError} />}
        {exercise.kind === "write" && <WriteExercise exercise={exercise} answers={answers} setAnswer={setAnswer} submitted={isSubmitted} showEmptyError={showEmptyError} />}
        {exercise.kind === "chooseVerb" && <ChooseVerbExercise exercise={exercise} verbSelections={verbSelections[exercise.id]} selectVerb={selectVerb} submitted={isSubmitted} showEmptyError={showEmptyError} />}
        {exercise.kind === "fillBlanks" && <FillBlanksExercise exercise={exercise} answers={answers} setAnswer={setAnswer} submitted={isSubmitted} showEmptyError={showEmptyError} />}

        <div className="flex items-center justify-between gap-3 pt-5">
          <button onClick={handlePrev} disabled={exerciseIndex === 0} className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
            ← Назад
          </button>
          <div className="flex gap-3">
            {!isSubmitted ? (
              <button onClick={handleCheck} className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: "#f97316" }}>
                Проверить
              </button>
            ) : (
              <button onClick={handleNext} className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition hover:opacity-90" style={{ backgroundColor: "#22c55e" }}>
                {exerciseIndex < totalExercises - 1 ? "Следующее →" : "Завершить ✓"}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-5">
          {exercises.map((_, i) => (
            <button key={i} onClick={() => setExerciseIndex(i)} className="w-3 h-3 rounded-full transition-all" style={{ backgroundColor: i === exerciseIndex ? "#f97316" : submitted[exercises[i].id] ? "#86efac" : "#d1d5db" }} title={`Задание ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
