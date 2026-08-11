"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Send } from "lucide-react";
import { formatRelativeTime, getNotifications, NotificationItem, pushNotification } from "@/lib/notifications";

const fieldClass = "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-500/40";
const templates = [
  { label: "Announcement", title: "📢 New announcement", body: "" },
  { label: "New content", title: "✨ New content is live", body: "Check out what's new in your Library." },
  { label: "Update", title: "🔧 We shipped an update", body: "" },
  { label: "Maintenance", title: "🛠️ Scheduled maintenance", body: "Some features may be briefly unavailable." }
];

export default function NotificationsPage() {
  const [list, setList] = useState<NotificationItem[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  function refresh() { setList(getNotifications()); }
  useEffect(() => { refresh(); }, []);

  function handleSend() {
    if (!title.trim() || !body.trim()) return;
    pushNotification({ id: `admin-${Date.now()}`, title, body });
    setTitle(""); setBody("");
    setSent(true);
    setTimeout(() => setSent(false), 1500);
    refresh();
  }

  return <div>
    <h1 className="text-lg font-extrabold text-white">Notifications</h1>
    <p className="mt-1 text-xs text-slate-500">Real, not staged—publishing here genuinely writes into this browser's notification feed and shows up in the real bell icon immediately (no push infrastructure exists, so it's this-browser-only, same as everything else in this app).</p>

    <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Compose</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {templates.map(t => <button key={t.label} type="button" onClick={() => { setTitle(t.title); setBody(t.body); }} className="cursor-pointer rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:bg-white/10">{t.label}</button>)}
        </div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className={`${fieldClass} mt-3`} />
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Body" className={`${fieldClass} mt-2 resize-none`} />
        <button type="button" onClick={handleSend} disabled={!title.trim() || !body.trim()} className="mt-3 flex cursor-pointer items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40">
          {sent ? <><Check size={13} />Sent</> : <><Send size={13} />Publish</>}
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Bell size={13} />Real feed ({list.length})</p>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {list.map(n => <div key={n.id} className="rounded-lg border border-white/10 p-2.5">
            <p className="text-xs font-bold text-white">{n.title}</p>
            <p className="mt-0.5 text-[11px] text-slate-400">{n.body}</p>
            <p className="mt-1 text-[10px] text-slate-600">{formatRelativeTime(n.createdAt)} · {n.read ? "Read" : "Unread"}</p>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}
