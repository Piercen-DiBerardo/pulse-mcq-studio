# Pulse MCQ Studio

A lightweight, clean, and ridiculously easy way to turn Excel question
banks into an interactive practice exam.\
No accounts, no backend, no tracking. Everything runs locally in your
browser.

------------------------------------------------------------------------

## 🚀 What This App Does

-   Import an `.xlsx` file containing your MCQs\
-   Automatically parse questions, answers, explanations, and
    multi-select rules\
-   Practice in a clean, Apple-style UI\
-   Get instant scoring\
-   Nothing is ever uploaded anywhere

------------------------------------------------------------------------

## 📦 Excel Format

Your Excel file must contain:

    id | question | A | B | C | D | correct | explanation | multi

Example:

    1 | Which are primes? | 2 | 4 | 5 | 9 | A,C | Because 2 & 5 are prime. | 1

-   `correct`: comma-separated letters\
-   `multi`: `1` if multiple answers allowed, `0` otherwise

------------------------------------------------------------------------

## 🎨 Features

-   Multi-answer support\
-   Live progress tracking\
-   Works entirely offline\
-   Simple CSV template included\
-   React + Tailwind + XLSX

------------------------------------------------------------------------

## 📘 Generating Exams From Your Notes

If you want to create new exams quickly, you can generate your entire
question bank using ChatGPT or any other generative AI tool.\
This is the workflow I usually follow:

1.  Copy your course notes or lecture slides\
2.  Paste them into ChatGPT\
3.  Upload the provided `mcq-template.xlsx`\
4.  Ask it to generate a full exam that matches the same format

You get high‑quality practice material without hand‑writing dozens of
questions.

### Example Prompt

    You are helping me create a university-level MCQ exam. 
    Use higher-order, conceptual, and multi-step reasoning questions only. 
    Difficulty should be appropriate for a 3rd-year course.

    I will upload an Excel file formatted like this:

    id | question | A | B | C | D | correct | explanation | multi

    Use the same column names and format exactly. 
    Do not rewrite them, rename them, or add new columns.

    Rules:
    - Write 50 multiple-choice questions based on my notes.
    - Some questions should be multi-select. Set multi=1 when multiple answers apply, otherwise 0.
    - The "correct" field must use letter keys (e.g., "B", or "A,C").
    - The "explanation" field should be short and helpful.
    - Do NOT number the questions yourself. Just fill the "id" column incrementally starting at 1.

    Once done, export everything as an XLSX file that I can download.

    Here are my notes:
    [PASTE YOUR NOTES HERE]

------------------------------------------------------------------------

## 🛠 Tech Stack

-   Next.js / React\
-   TailwindCSS\
-   XLSX (SheetJS) for Excel parsing\
-   Fully client-side

------------------------------------------------------------------------

## 🧩 Local Development

``` bash
npm install
npm run dev
```

Open the local server and drop in a spreadsheet to get started
immediately.

------------------------------------------------------------------------

## 🤝 Contributing

Pull requests are welcome.

------------------------------------------------------------------------

## 📝 License

MIT License.

------------------------------------------------------------------------

## 💬 Notes

This project started as a quick tool for studying, and slowly turned
into a full mini app.\
Have fun practicing and good luck with your exams. Don't blame me if you still get cooked.
