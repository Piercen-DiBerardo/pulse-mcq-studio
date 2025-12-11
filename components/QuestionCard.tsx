"use client";

import React from "react";
import type { MCQQuestion } from "@/lib/parseExcel";

type Props = {
  index: number;
  question: MCQQuestion;
  selected: string[];
  multi: boolean;
  onChange: (value: string) => void;
  showResult: boolean;
};

export const QuestionCard: React.FC<Props> = ({
  index,
  question,
  selected,
  multi,
  onChange,
  showResult,
}) => {
  const hasAnswered = selected.length > 0;

  const isFullyCorrect =
    selected.length === question.correct.length &&
    [...selected].sort().join(",") === [...question.correct].sort().join(",");

  const handleClick = (key: string) => {
    onChange(key);
  };

  return (
    <div className="glass fade-in rounded-3xl p-6 md:p-7">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="pill flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              showResult && hasAnswered
                ? (isFullyCorrect ? "bg-emerald-400" : "bg-rose-400")
                : "bg-blue-400"
            }`}
          />

          Question {index + 1}

          {multi && (
            <span className="text-[10px] ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-700">
              Multi-select
            </span>
          )}
        </div>

        {showResult && hasAnswered && (
          <span
            className={`pill ${
              isFullyCorrect
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {isFullyCorrect ? "Correct" : "Review this one"}
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="mb-5 text-base font-semibold text-zinc-900 md:text-lg">
        {question.question}
      </p>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((opt) => {
          const active = selected.includes(opt.key);
          const isCorrectOpt = showResult && question.correct.includes(opt.key);
          const isWrongSelected =
            showResult && active && !question.correct.includes(opt.key);

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleClick(opt.key)}
              className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm md:text-base transition
                ${
                  active
                    ? "border-accent bg-accent/5"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }
                ${isCorrectOpt ? "border-emerald-500 bg-emerald-50/60" : ""}
                ${isWrongSelected ? "border-rose-500 bg-rose-50/70" : ""}
              `}
            >
              <span
                className={`option-pill ${
                  active ? "option-pill-selected" : ""
                }
                ${isCorrectOpt ? "border-emerald-500 bg-emerald-500 text-white" : ""}
                ${isWrongSelected ? "border-rose-500 bg-rose-500 text-white" : ""}
                `}
              >
                {opt.key}
              </span>

              <span className="text-zinc-800">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="mt-4 space-y-1.5 text-sm text-zinc-600">
          <p>
            <span className="font-semibold text-zinc-900">Answer:</span>{" "}
            {question.correct.join(", ")}
          </p>

          {question.explanation && (
            <p>
              <span className="font-semibold text-zinc-900">Why:</span>{" "}
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
