import type { Metadata } from "next";
import { Figtree, Noto_Sans } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Studium — Learn your way",
  description: "Your intelligent study companion, designed around how you learn."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${figtree.variable} ${notoSans.variable}`}><body>{children}</body></html>;
}
