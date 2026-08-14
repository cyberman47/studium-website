"use client";

import { useEffect, useRef, useState } from "react";

// Scientific Method's own "Listen" controller. The rest of the app only has
// components/interactive-text.tsx's speakTerm()—a fire-and-forget single
// word/definition utterance with no pause/resume/seek state—so there's
// nothing existing to reuse for a full multi-minute lesson read-along.
// Built here, isolated to this lesson's folder, rather than as a shared
// hook, per the prototype's isolation requirement.
//
// The Web Speech API has no real seek—"skip ±10s" is approximated by
// jumping a sentence at a time (the same unit play/pause naturally align
// to), which is an honest, working approximation rather than a fake
// precise-seconds claim.
const RATES = [1, 1.25, 1.5, 0.75] as const;

function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

export function useLessonSpeech(fullText: string) {
  const sentencesRef = useRef<string[]>([]);
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rateIndex, setRateIndex] = useState(0);
  const [chunkIndex, setChunkIndex] = useState(0);
  const chunkIndexRef = useRef(0);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    sentencesRef.current = splitIntoSentences(fullText);
  }, [fullText]);

  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis.cancel(); }, []);

  function speakFrom(index: number) {
    const sentences = sentencesRef.current;
    if (!supported || index >= sentences.length) { setPlaying(false); setPaused(false); return; }
    window.speechSynthesis.cancel();
    const remaining = sentences.slice(index);
    // Precompute each remaining sentence's character offset within the
    // joined utterance text, so onboundary's charIndex can be mapped back
    // to a real sentence position—skip-during-playback then jumps from
    // wherever speech actually is, not just the last explicit position.
    const offsets: number[] = [];
    let cursor = 0;
    for (const s of remaining) { offsets.push(cursor); cursor += s.length + 1; }
    const utterance = new SpeechSynthesisUtterance(remaining.join(" "));
    utterance.rate = RATES[rateIndex];
    utterance.onboundary = e => {
      let localIdx = 0;
      for (let i = offsets.length - 1; i >= 0; i--) { if (e.charIndex >= offsets[i]) { localIdx = i; break; } }
      const absolute = index + localIdx;
      chunkIndexRef.current = absolute;
      setChunkIndex(absolute);
    };
    utterance.onend = () => { setPlaying(false); setPaused(false); };
    utterance.onerror = () => { setPlaying(false); setPaused(false); };
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
    setPaused(false);
  }

  function play() {
    if (paused) { window.speechSynthesis.resume(); setPaused(false); setPlaying(true); return; }
    speakFrom(chunkIndexRef.current);
  }

  function pause() {
    window.speechSynthesis.pause();
    setPaused(true);
    setPlaying(false);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setPlaying(false);
    setPaused(false);
    chunkIndexRef.current = 0;
    setChunkIndex(0);
  }

  // ±1 sentence, not a literal ±10 seconds—see the module comment above.
  function skip(direction: 1 | -1) {
    const sentences = sentencesRef.current;
    const next = Math.max(0, Math.min(sentences.length - 1, chunkIndexRef.current + direction));
    chunkIndexRef.current = next;
    setChunkIndex(next);
    if (playing || paused) speakFrom(next);
  }

  function cycleRate() {
    setRateIndex(i => {
      const next = (i + 1) % RATES.length;
      if (playing) {
        // Restart at the new rate from the current position rather than
        // letting the in-flight utterance keep the old rate to the end.
        window.speechSynthesis.cancel();
        const sentences = sentencesRef.current;
        const utterance = new SpeechSynthesisUtterance(sentences.slice(chunkIndexRef.current).join(" "));
        utterance.rate = RATES[next];
        utterance.onend = () => { setPlaying(false); setPaused(false); };
        utterance.onerror = () => { setPlaying(false); setPaused(false); };
        window.speechSynthesis.speak(utterance);
      }
      return next;
    });
  }

  return {
    supported, playing, paused, rate: RATES[rateIndex], chunkIndex, totalChunks: sentencesRef.current.length,
    play, pause, stop, skip, cycleRate
  };
}
