"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  lang?: string;
}

export function VoiceButton({
  onTranscript,
  className,
  lang = "fr-FR",
}: VoiceButtonProps) {
  const [supported, setSupported] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const finalRef = React.useRef("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
    setSupported(Boolean(Ctor));
  }, []);

  const stop = React.useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = React.useCallback(() => {
    setError(null);
    finalRef.current = "";
    const Ctor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalRef.current += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      onTranscript((finalRef.current + interim).trim());
    };
    recognition.onerror = (event) => {
      setError(
        event.error === "not-allowed"
          ? "Accès au micro refusé. Active-le dans les réglages du navigateur."
          : "La reconnaissance vocale a rencontré une erreur.",
      );
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.onstart = () => {
      setListening(true);
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError("Impossible de démarrer le micro.");
      setListening(false);
    }
  }, [lang, onTranscript]);

  if (!supported) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-sand bg-paper px-3 py-1.5 text-sm font-medium text-ink shadow-[var(--shadow-level-1)] transition-colors hover:bg-mist",
          listening && "border-coral/40 bg-coral/[0.08] text-coral",
        )}
      >
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            listening ? "bg-coral" : "bg-muted",
          )}
        >
          {listening ? (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
          ) : null}
        </span>
        {listening ? "Arrêter le micro" : "Parler"}
      </button>
      {error ? <span className="text-xs text-coral">{error}</span> : null}
    </div>
  );
}
