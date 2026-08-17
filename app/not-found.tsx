import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { LanguageBar, Logo } from "@/components/navigation";
import { PrimaryButton } from "@/components/ui";

// Next's built-in 404—renders automatically for any unmatched route (a
// mistyped URL, a stale bookmark, a dead link) with no route file of its
// own to wire up. Same page shell as login/signup so it doesn't feel like a
// dead end outside the app.
export default function NotFound() {
  return <main className="min-h-screen bg-[#fcfdfd]">
    <LanguageBar />
    <header className="border-b border-slate-100 bg-white/85 py-4 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between">
        <Logo />
        <Link href="/" className="inline-flex cursor-pointer items-center gap-2 text-sm font-extrabold text-slate-600 transition hover:text-teal-600"><ArrowLeft size={16} />Back to home</Link>
      </div>
    </header>
    <section className="relative py-20 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
      <div className="container-page">
        <div className="mx-auto max-w-lg text-center">
          <span className="eyebrow mx-auto"><Compass size={13} />404 error</span>
          <p className="display mt-6 text-7xl text-teal-500 sm:text-8xl">404</p>
          <h1 className="display mt-4 text-3xl leading-tight sm:text-4xl">We couldn't find that page.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">The link might be broken, or the page may have moved. Let's get you back to your study plan instead.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton href="/">Back to home</PrimaryButton>
            <Link href="/dashboard" className="cursor-pointer text-sm font-bold text-teal-600 hover:text-teal-700">Go to my dashboard</Link>
          </div>
        </div>
      </div>
    </section>
  </main>;
}
