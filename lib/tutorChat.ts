// Real, persisted chat history per lesson—genuinely saved and reloaded,
// genuinely carries real lesson/flashcard/mode context with every message,
// and now genuinely answered: sendMessage() kicks off a real streamed call
// to /api/tutor (a secure server route holding the Anthropic key), and the
// reply is written into the same chat history incrementally as it arrives.

export type TutorMode = "tutor" | "deepdive" | "simplify";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
  // True while a reply is still streaming in—lets the UI show a live
  // typing/in-progress state instead of an atomic pop-in.
  streaming?: boolean;
  // True if this message is a genuine failure notice, not a model reply—
  // kept visually and semantically distinct so it's never mistaken for one.
  error?: boolean;
};

export type TutorContext = {
  sectionName: string;
  subjectName: string;
  lessonTitle: string;
  lessonId: string;
  currentStep: string;
  currentFlashcard?: { front: string; back: string } | null;
  // Set while a practice question is on screen, so the tutor knows both the
  // exact question and whether/what the student answered—not just that
  // "Practice" is the current step.
  currentPracticeQuestion?: { question: string; studentAnswer: string | null } | null;
  recentMistakes: string[];
  studentLevel: string;
  // The student's real "Currently Studying" track label (lib/currentPath.ts)
  // at send-time—lets /api/tutor frame its answer for their actual field.
  currentTrack?: string;
  // A free-text snapshot of exactly what's on the student's screen right
  // now—a lesson concept's own text, a flashcard's front/back, or a quiz
  // question's own options—captured locally in the browser at zero AI
  // cost. Only ever attached when something more specific than "the whole
  // lesson" is on screen; /api/tutor quotes it verbatim to the model so a
  // reply is grounded in exactly what the student is already looking at,
  // not a guess at what "this" refers to. The real API call (and its
  // credit cost) only happens once the student actually sends a message—
  // attaching this text is free.
  currentOnScreenText?: string | null;
};

const CHAT_KEY_PREFIX = "studium_tutor_chat_";
const MODE_KEY = "studium_tutor_mode";
export const TUTOR_CHAT_EVENT = "studium:tutorChatChange";

function chatKey(lessonId: string) {
  return `${CHAT_KEY_PREFIX}${lessonId}`;
}

export function getChatHistory(lessonId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(chatKey(lessonId));
  return raw ? JSON.parse(raw) : [];
}

function saveChatHistory(lessonId: string, messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(chatKey(lessonId), JSON.stringify(messages));
  window.dispatchEvent(new CustomEvent(TUTOR_CHAT_EVENT));
}

// Reads the freshest copy before patching one message by id, so a background
// stream update never clobbers something the user did in another tab/panel
// in between chunks.
function patchMessage(lessonId: string, id: string, patch: Partial<ChatMessage>) {
  const current = getChatHistory(lessonId);
  const next = current.map(m => (m.id === id ? { ...m, ...patch } : m));
  saveChatHistory(lessonId, next);
}

export const modeLabels: Record<TutorMode, string> = {
  tutor: "Tutor",
  deepdive: "Deep Dive",
  simplify: "Simplify"
};

const validModes: TutorMode[] = ["tutor", "deepdive", "simplify"];

// Streams a real reply from /api/tutor into the assistant placeholder
// already sitting in chat history, throttling writes so a fast stream
// doesn't hammer localStorage on every few-character chunk.
async function streamAssistantReply(lessonId: string, assistantId: string, userText: string, mode: TutorMode, context: TutorContext) {
  const priorHistory = getChatHistory(lessonId)
    .filter(m => m.id !== assistantId && !m.error && !m.streaming)
    .map(m => ({ role: m.role, text: m.text }));

  try {
    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText, mode, context, history: priorHistory })
    });

    if (!res.ok || !res.body) {
      let errorText = "The AI Tutor couldn't reply just now. Please try again.";
      try {
        const data = await res.json();
        if (typeof data?.error === "string") errorText = data.error;
      } catch {
        // Non-JSON error body—fall back to the generic message above.
      }
      patchMessage(lessonId, assistantId, { text: errorText, streaming: false, error: true });
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    let lastFlush = 0;
    const FLUSH_INTERVAL_MS = 60;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      const now = Date.now();
      if (now - lastFlush >= FLUSH_INTERVAL_MS) {
        patchMessage(lessonId, assistantId, { text });
        lastFlush = now;
      }
    }
    text += decoder.decode();
    patchMessage(lessonId, assistantId, { text, streaming: false });
  } catch {
    patchMessage(lessonId, assistantId, {
      text: "The AI Tutor couldn't reply just now—check your connection and try again.",
      streaming: false,
      error: true
    });
  }
}

// Keeps the exact old synchronous signature and ChatMessage[] return so
// every existing call site works unchanged: it appends the real user
// message plus a streaming placeholder, persists immediately, and kicks off
// the real network call in the background. Updates land in the same
// storage key + TUTOR_CHAT_EVENT the UI already listens to.
export function sendMessage(lessonId: string, userText: string, mode: TutorMode, context: TutorContext): ChatMessage[] {
  const userMessage: ChatMessage = { id: `msg-${Date.now()}-u`, role: "user", text: userText, createdAt: new Date().toISOString() };
  const assistantMessage: ChatMessage = { id: `msg-${Date.now()}-a`, role: "assistant", text: "", createdAt: new Date().toISOString(), streaming: true };
  const next = [...getChatHistory(lessonId), userMessage, assistantMessage];
  saveChatHistory(lessonId, next);
  void streamAssistantReply(lessonId, assistantMessage.id, userText, mode, context);
  return next;
}

export function clearChatHistory(lessonId: string) {
  saveChatHistory(lessonId, []);
}

export function getTutorMode(): TutorMode {
  if (typeof window === "undefined") return "tutor";
  const stored = localStorage.getItem(MODE_KEY);
  // Guards against a stale "socratic" value left in localStorage from
  // before Deep Dive replaced it—falls back to the default instead of
  // handing an unrecognized mode to the UI or the API route.
  return validModes.includes(stored as TutorMode) ? (stored as TutorMode) : "tutor";
}

export function setTutorMode(mode: TutorMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_KEY, mode);
}
