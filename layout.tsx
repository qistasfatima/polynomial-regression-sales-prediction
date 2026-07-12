import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-Powered Sales Prediction | Polynomial Regression",
  description:
    "Premium ML dashboard predicting product sales from TV, Radio, and Newspaper advertising budgets using Polynomial Regression.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen bg-surface text-white">
        {children}
      </body>
    </html>
  );
}
