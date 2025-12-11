"use client";

import React from "react";
import { parseMCQWorkbook, type MCQQuestion } from "../lib/parseExcel";
import { QuestionCard } from "../components/QuestionCard";

type AnswerMap = Record<string, string[]>;

// Main page. Handles reading the Excel file and running the whole quiz flow.
export default function HomePage() {
  const [questions, setQuestions] = React.useState<MCQQuestion[] | null>(null);
  const [answers, setAnswers] = React.useState<AnswerMap>({});
  const [showResult, setShowResult] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [score, setScore] = React.useState<{ correct: number; total: number } | null>(
    null
  );

  // Triggered when the user drops an Excel file in. Converts it into usable question data.
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the UI whenever a new file is selected.
    setError(null);
    setLoading(true);
    setShowResult(false);
    setScore(null);
    setAnswers({});

    try {
      const parsed = await parseMCQWorkbook(file);
      setQuestions(parsed);
    } catch (err: any) {
      console.error(err);
      // If the Excel columns are wrong or formatted weird, this will fire.
      setError(err?.message ?? "Could not read this file. Check the column names and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handles selecting answers. Supports single-select and multi-select questions.
  const handleChangeAnswer = (qid: string, value: string) => {
    setAnswers((prev) => {
      const q = questions?.find((qq) => qq.id === qid);
      if (!q) return prev;

      // If the question only allows one answer, just overwrite the array.
      if (!q.multi) {
        return { ...prev, [qid]: [value] };
      }

      // Multi-select toggle logic.
      const current = prev[qid] ?? [];
      const exists = current.includes(value);
      const updated = exists
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [qid]: updated };
    });
  };

  // Just comparing arrays without caring about order.
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    return [...a].sort().join(",") === [...b].sort().join(",");
  };

  // When the user submits their answers, count how many are correct.
  const handleSubmit = () => {
    if (!questions) return;

    let correctCount = 0;

    for (const q of questions) {
      const selected = answers[q.id] ?? [];
      const correct = q.correct ?? [];

      if (arraysEqual(selected, correct)) {
        correctCount++;
      }
    }

    setScore({ correct: correctCount, total: questions.length });
    setShowResult(true);
  };

  // Clears all selections without touching the loaded questions.
  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
    setScore(null);
  };

  // Rough completion percentage based on how many questions have at least one answer.
  const completion =
    questions && questions.length > 0
      ? Math.round(
          (Object.values(answers).filter((arr) => arr && arr.length > 0).length /
            questions.length) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 md:pt-14">
        
        {/* Header */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">

            <div className="pill w-fit bg-zinc-900 text-zinc-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Pulse  MCQ Studio
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
                Practise MCQ Exam Studio.
              </h1>

              <p className="max-w-xl text-sm text-zinc-600 md:text-base">
                Drop in your Excel question bank and start practicing instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="pill bg-zinc-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Everything stays on your device
              </span>

              <span className="pill bg-zinc-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Import straight from Excel
              </span>
            </div>
          </div>

          {/* Progress card */}
          <div className="glass relative flex w-full max-w-sm flex-col gap-4 rounded-3xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Progress</span>
              <span className="text-xs font-semibold text-zinc-800">
                {completion || 0}% answered
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-zinc-200">
              <div
                className="h-2 rounded-full bg-zinc-900 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
              <span>
                {questions ? `${questions.length} questions` : "No questions loaded"}
              </span>

              {score && (
                <span className="font-semibold text-zinc-900">
                  {score.correct}/{score.total} correct
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Upload section */}
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">1. Import questions</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Use an Excel file with the columns shown below. Once it loads, you are ready to go.
                </p>
              </div>

              <button
                type="button"
                className="primary-btn-outline text-xs"
                onClick={() => {
                  const csvTemplate =
                    "id,question,A,B,C,D,correct,explanation,multi\n" +
                    '1,"Which are primes?",2,4,5,9,"A,C","Because 2 & 5 are prime.,1"';
                  const blob = new Blob([csvTemplate], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "mcq-template.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download template
              </button>
            </div>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 px-4 py-10 text-center transition hover:border-zinc-400 hover:bg-zinc-100">
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-50">
                ⬆️
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-900">
                  Drag your Excel file here or click to pick one
                </p>
                <p className="text-xs text-zinc-500">
                  The file is only read in your browser.
                </p>
              </div>
            </label>

            {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
            {loading && (
              <p className="mt-3 text-xs text-zinc-500">
                Reading your file, preparing your questions...
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="glass flex flex-col justify-between rounded-3xl p-6">
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900">2. Answer the questions</h2>
              <p className="text-xs text-zinc-500">
                Work through the exam at your own pace. Submit to see how you did.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="primary-btn"
                onClick={handleSubmit}
                disabled={!questions || questions.length === 0}
              >
                {showResult ? "Recalculate score" : "Check my answers"}
              </button>

              <button
                type="button"
                className="primary-btn-outline"
                onClick={handleReset}
                disabled={!questions}
              >
                Reset answers
              </button>
            </div>

            {score && (
              <div className="mt-6 rounded-2xl bg-zinc-900 p-4 text-zinc-50">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Results</p>

                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-semibold">
                      {score.correct}/{score.total}
                    </p>
                    <p className="text-xs text-zinc-300">
                      {Math.round((score.correct / score.total) * 100)} percent accuracy
                    </p>
                  </div>

                  <div className="text-right text-xs text-zinc-400">
                    <p>
                      {score.correct === score.total
                        ? "Perfect score, nice work."
                        : score.correct / score.total >= 0.8
                        ? "Great job, you are almost there."
                        : "Good progress, keep practicing."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Questions list */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">
              {questions ? "Questions" : "No exam loaded"}
            </h2>

            {questions && (
              <p className="text-xs text-zinc-500">
                Some questions may require multiple selections. {showResult && "Results are visible."}
              </p>
            )}
          </div>

          {!questions && (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
              Load an Excel file to begin.
            </div>
          )}

          {questions && (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  index={idx}
                  question={q}
                  selected={answers[q.id] ?? []}
                  multi={q.multi}
                  onChange={(val) => handleChangeAnswer(q.id, val)}
                  showResult={showResult}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
