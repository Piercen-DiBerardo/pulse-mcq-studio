import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse | MCQ Exam Studio",
  description: "Elegant MCQ practice app for exam prep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
