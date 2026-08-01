import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studium — Learn your way",
  description: "Your intelligent study companion, designed around how you learn."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
