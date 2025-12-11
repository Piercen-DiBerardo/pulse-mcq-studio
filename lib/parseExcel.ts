import * as XLSX from "xlsx";

export type MCQQuestion = {
  id: string;
  question: string;
  options: { key: string; label: string }[];
  correct: string[];
  explanation?: string;
  multi: boolean;
};

export function parseMCQWorkbook(file: File): Promise<MCQQuestion[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const questions: MCQQuestion[] = json.map((row, idx) => {
          const id = String(row.id ?? idx + 1);
          const question = String(row.question ?? "").trim();

          // Build options A-D dynamically
          const options = [
            { key: "A", label: String(row.A ?? row.optionA ?? "").trim() },
            { key: "B", label: String(row.B ?? row.optionB ?? "").trim() },
            { key: "C", label: String(row.C ?? row.optionC ?? "").trim() },
            { key: "D", label: String(row.D ?? row.optionD ?? "").trim() },
          ].filter((o) => o.label.length > 0);

          // multiple correct answers handling
          const correctRaw = String(row.correct ?? row.answer ?? "")
            .trim()
            .toUpperCase();

          // Split on anything: commas, spaces, semicolons (also supports "ACD")
          const correct = correctRaw
            .replace(/[^A-D]/g, "") // remove weird chars
            .split("") // turn "ACD" into ["A","C","D"]
            .filter((key, idx, arr) => ["A", "B", "C", "D"].includes(key) && arr.indexOf(key) === idx);

          // If empty, fallback to first option
          const finalCorrect =
            correct.length > 0 ? correct : options.length > 0 ? [options[0].key] : [];

          const explanation = String(row.explanation ?? "").trim() || undefined;

          const multiRaw = String(row.multi ?? "").trim().toLowerCase();
          const multi =
            multiRaw === "1" ||
            multiRaw === "true" ||
            multiRaw === "yes";

          if (!question || options.length === 0) {
            throw new Error(
              `Row ${idx + 2} invalid. Ensure it includes 'question', options, and 'correct'.`
            );
          }

          return { id, question, options, correct: finalCorrect, explanation, multi };
        });

        resolve(questions);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
