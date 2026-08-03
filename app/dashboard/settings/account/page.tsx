"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Calendar, Camera, Clock3, Crown, Lock, LogOut, RotateCcw, Sparkles, Trash2, X } from "lucide-react";
import { Field, inputClass } from "@/components/ui";
import { getUser, updateUser } from "@/lib/onboarding";
import { getTotalHours } from "@/lib/progress";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export default function AccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [totalHours, setTotalHours] = useState(0);
  const [savedIdentity, setSavedIdentity] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");

  const [deleteStep, setDeleteStep] = useState<"closed" | "reason" | "confirm">("closed");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    const user = getUser();
    setName(user?.name || "");
    setUsername(user?.username || "");
    setEmail(user?.email || "");
    setAvatar(user?.avatar ?? null);
    setJoinedAt(user?.joinedAt || "");
    setTotalHours(getTotalHours());
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) { setAvatarError("Please choose an image file."); return; }
    if (file.size > MAX_AVATAR_BYTES) { setAvatarError("Image is too large—please choose one under 2MB."); return; }
    setAvatarError("");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      updateUser({ avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    setAvatar(null);
    setAvatarError("");
    updateUser({ avatar: null });
  }

  function handleSaveIdentity(e: React.FormEvent) {
    e.preventDefault();
    updateUser({ username, email });
    setSavedIdentity(true);
    setTimeout(() => setSavedIdentity(false), 2500);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordNotice("Fill in all three fields."); return; }
    if (newPassword.length < 8) { setPasswordNotice("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordNotice("New passwords don't match."); return; }
    setPasswordNotice("Password changes aren't connected to a real account system in this demo.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function resetOnboarding() {
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/onboarding");
  }

  function logOut() {
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    router.push("/");
  }

  function openDeleteFlow() {
    setDeleteReason("");
    setDeleteConfirmText("");
    setDeleteStep("reason");
  }

  function closeDeleteFlow() {
    setDeleteStep("closed");
  }

  function confirmDelete() {
    if (deleteConfirmText !== "DELETE") return;
    localStorage.removeItem("studium_user");
    localStorage.removeItem("studium_onboarding_answers");
    localStorage.removeItem("studium_onboarding_complete");
    localStorage.removeItem("studium_preferences");
    localStorage.removeItem("studium_app_settings");
    localStorage.removeItem("studium_active_days");
    router.push("/");
  }

  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const joinedLabel = joinedAt ? new Date(joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—";

  return <section className="relative py-10 sm:py-14">
    <div className="absolute inset-x-0 top-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_50%_0%,#d7f3f1,transparent_65%)]" />
    <span className="eyebrow"><Sparkles size={13} />Settings</span>
    <h1 className="display mt-5 text-4xl leading-tight sm:text-5xl">Account.</h1>
    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-500">Your sign-in details and account actions.</p>

    <div className="mt-10 max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Calendar size={13} />Member since</div>
          <p className="mt-3 text-xl font-extrabold text-ink">{joinedLabel}</p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Crown size={13} />Current tier</div>
          <p className="mt-3 text-xl font-extrabold text-ink">Starter <span className="text-sm font-bold text-slate-400">· Free</span></p>
          <Link href="/dashboard/settings/billing" className="mt-1.5 inline-block cursor-pointer text-xs font-extrabold text-teal-600 hover:text-teal-700">Change plan →</Link>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-slate-500"><Clock3 size={13} />Total hours</div>
          <p className="mt-3 text-xl font-extrabold text-ink">{totalHours}<span className="text-sm font-bold text-slate-400"> hrs</span></p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">Profile &amp; login</h2>
        <div className="mt-5 flex items-center gap-5">
          <div className="relative shrink-0">
            {avatar
              ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
              : <span className="grid h-20 w-20 place-items-center rounded-full bg-teal-100 text-2xl font-extrabold text-teal-700">{initial}</span>}
            <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Change profile picture" className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-white bg-ink text-white shadow transition hover:bg-slate-700">
              <Camera size={14} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-ink">{name || "Your name"}</p>
            <p className="mt-0.5 text-xs text-slate-500">To change your name, head to <Link href="/dashboard/settings/profile" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">Profile</Link>.</p>
            {avatar && <button type="button" onClick={removeAvatar} className="mt-1.5 cursor-pointer text-xs font-bold text-rose-600 hover:text-rose-700">Remove photo</button>}
            {avatarError && <p className="mt-1.5 text-xs font-bold text-rose-600">{avatarError}</p>}
          </div>
        </div>

        <form onSubmit={handleSaveIdentity} className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Username"><input value={username} onChange={e => setUsername(e.target.value)} placeholder="jane_doe" className={inputClass} /></Field>
          <Field label="Email address"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" className={inputClass} /></Field>
          <div className="flex items-center gap-4 sm:col-span-2">
            <button type="submit" className="cursor-pointer rounded-full bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-[0_12px_25px_-12px_#047857] transition hover:-translate-y-0.5 hover:bg-accent-600">Save changes</button>
            {savedIdentity && <span className="text-sm font-bold text-teal-600">Saved ✓</span>}
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight"><Lock size={17} className="text-teal-600" />Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          <Field label="Current password"><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className={inputClass} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New password"><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 8 characters" className={inputClass} /></Field>
            <Field label="Confirm new password"><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className={inputClass} /></Field>
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" className="cursor-pointer rounded-full border border-slate-200 px-6 py-2.5 text-sm font-bold text-ink transition hover:border-teal-200 hover:bg-[#f9fcfc]">Update password</button>
          </div>
          {passwordNotice && <p className="text-xs font-bold text-slate-500">{passwordNotice}</p>}
        </form>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">Account actions</h2>
        <div className="mt-4 space-y-3">
          <button type="button" onClick={resetOnboarding} className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-teal-200 hover:bg-[#f9fcfc]">
            <span><span className="block text-sm font-bold text-ink">Retake onboarding</span><span className="block text-xs text-slate-500">Redo the welcome questions to update your study profile.</span></span>
            <RotateCcw size={16} className="shrink-0 text-slate-400" />
          </button>
          <button type="button" onClick={logOut} className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-rose-200 hover:bg-rose-50">
            <span className="text-sm font-bold text-rose-600">Log out</span>
            <LogOut size={16} className="shrink-0 text-rose-400" />
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft sm:p-7">
        <h2 className="text-lg font-extrabold tracking-tight">Delete account</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">If at any time you are not satisfied with Studium, please let us know and we will do our best to resolve the situation. You may email us at <a href="mailto:hello@studium.app" className="cursor-pointer font-bold text-teal-600 hover:text-teal-700">hello@studium.app</a>. Please only delete your account if you are sure that you no longer wish to use Studium.</p>
        <button type="button" onClick={openDeleteFlow} className="mt-5 flex cursor-pointer items-center gap-2 rounded-full border border-rose-200 px-5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50">
          <Trash2 size={15} />Delete your account
        </button>
      </div>
    </div>

    <AnimatePresence>
      {deleteStep !== "closed" && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={closeDeleteFlow}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift sm:p-7"
        >
          {deleteStep === "reason" ? <>
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Trash2 size={20} /></span>
              <button type="button" onClick={closeDeleteFlow} aria-label="Close" className="cursor-pointer rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"><X size={18} /></button>
            </div>
            <h2 className="display mt-4 text-2xl">Before you go</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Why are you deleting your account? If there's anything we can help with, let us know—we'll do our best to fix it.</p>
            <textarea value={deleteReason} onChange={e => setDeleteReason(e.target.value)} rows={3} placeholder="Tell us what happened…" className={`${inputClass} mt-4 resize-none`} />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeDeleteFlow} className="cursor-pointer rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-slate-50">Never mind, keep my account</button>
              <button type="button" onClick={() => setDeleteStep("confirm")} className="cursor-pointer rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-rose-700">Continue</button>
            </div>
          </> : <>
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={20} /></span>
              <button type="button" onClick={closeDeleteFlow} aria-label="Close" className="cursor-pointer rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"><X size={18} /></button>
            </div>
            <h2 className="display mt-4 text-2xl">Delete your account</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">This permanently erases your profile, streak, and settings from this browser. This can't be undone.</p>
            <p className="mt-4 text-xs font-extrabold text-slate-600">Type DELETE to confirm</p>
            <input value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder="DELETE" className={`${inputClass} mt-1.5`} />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setDeleteStep("reason")} className="cursor-pointer rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-slate-50">Back</button>
              <button type="button" disabled={deleteConfirmText !== "DELETE"} onClick={confirmDelete} className="cursor-pointer rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">Delete my account</button>
            </div>
          </>}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}
