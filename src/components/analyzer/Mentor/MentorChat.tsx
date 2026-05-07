"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Callout } from "@/components/ui/Callout";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Tag } from "@/components/ui/Tag";
import { Textarea } from "@/components/ui/Field";
import { analysesStore, mentorStore } from "@/lib/storage/analyses";
import { uid } from "@/lib/utils";
import type {
  ApiError,
  BusinessAnalysis,
  MentorMessage,
} from "@/lib/types";

const SUGGESTIONS = [
  "Comment je trouve mes 100 premiers clients ?",
  "Quel pricing choisir pour démarrer ?",
  "Écris-moi une landing page pour tester cette idée",
  "Prépare-moi un pitch en 2 min pour un investisseur",
  "Qu'est-ce que je dois faire cette semaine ?",
  "Comment je peux réduire le risque acquisition ?",
];

export function MentorChat({ id }: { id: string }) {
  const router = useRouter();
  const [analysis, setAnalysis] = React.useState<BusinessAnalysis | null>(null);
  const [messages, setMessages] = React.useState<MentorMessage[]>([]);
  const [draft, setDraft] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ApiError | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setAnalysis(analysesStore.get(id) ?? null);
    setMessages(mentorStore.get(id));
    setHydrated(true);
  }, [id]);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, loading]);

  async function send(content: string) {
    if (!analysis || !content.trim() || loading) return;
    setError(null);
    const userMsg: MentorMessage = {
      id: uid("m"),
      role: "user",
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    mentorStore.set(id, next);
    setDraft("");
    setLoading(true);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis, messages: next }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: ApiError }
          | null;
        throw (
          data?.error ?? {
            code: "network_error",
            message: `Erreur ${res.status}`,
          }
        );
      }
      const { content: reply } = (await res.json()) as { content: string };
      const assistantMsg: MentorMessage = {
        id: uid("m"),
        role: "assistant",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      const merged = [...next, assistantMsg];
      setMessages(merged);
      mentorStore.set(id, merged);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) return null;

  if (!analysis) {
    return (
      <div className="mx-auto w-full max-w-[1080px] px-5 py-16 sm:px-8">
        <EmptyState
          title="Pas d'analyse trouvée pour le mentor"
          description="Le mentor s'attache à une analyse existante. Lance-en une d'abord."
          action={
            <Button onClick={() => router.push("/")} withArrow={false}>
              Lancer une analyse
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <header className="space-y-2">
            <Link
              href={`/analysis/${analysis.id}`}
              className="text-sm text-vivid-blue hover:underline"
            >
              ← Retour au rapport
            </Link>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Mentor IA —{" "}
              <span className="font-serif-italic text-olive">
                contexte du rapport conservé
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              Pose tes questions opérationnelles. Le mentor garde l'analyse en
              mémoire. Demande un livrable (landing, pitch, séquence) et
              reçois-le directement utilisable.
            </p>
          </header>

          <Card surface="paper" elevation="2" radius="xl" className="space-y-4">
            <div
              ref={listRef}
              className="scrollbar-quiet max-h-[60vh] min-h-[280px] space-y-4 overflow-y-auto pr-1"
            >
              {messages.length === 0 ? (
                <Callout tone="info" title="Démarrer la conversation">
                  Pose une question concrète. Plus elle est spécifique, plus la
                  réponse est utile. Exemple : « Écris-moi 3 messages LinkedIn
                  pour atteindre les agences immobilières en Île-de-France. »
                </Callout>
              ) : null}
              {messages.map((m) => (
                <Message key={m.id} message={m} />
              ))}
              {loading ? <TypingIndicator /> : null}
            </div>

            {error ? (
              <ErrorState
                title="Le mentor n'a pas pu répondre"
                message={error.message}
                recoveryHint={error.recoveryHint}
                onRetry={() => {
                  if (messages.length > 0 && messages[messages.length - 1].role === "user") {
                    void send(messages[messages.length - 1].content);
                  }
                }}
              />
            ) : null}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(draft);
              }}
              className="space-y-2"
            >
              <Textarea
                rows={3}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Demande au mentor — sois concret."
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    void send(draft);
                  }
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted">
                  Astuce : ⌘ + Entrée pour envoyer
                </span>
                <div className="flex flex-wrap gap-2">
                  {messages.length > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      withArrow={false}
                      onClick={() => {
                        mentorStore.clear(id);
                        setMessages([]);
                      }}
                    >
                      Effacer
                    </Button>
                  ) : null}
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={loading}
                    disabled={draft.trim().length < 2}
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card surface="shell" elevation="1" radius="lg" className="space-y-3">
            <p className="label-uppercase text-muted">Contexte épinglé</p>
            <p className="text-sm leading-relaxed text-ink line-clamp-5">
              {analysis.idea}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Tag tone="ink">{analysis.verdict}</Tag>
              <Tag tone="neutral">
                Viabilité {analysis.viabilityScore}/100
              </Tag>
            </div>
            <Link
              href={`/analysis/${analysis.id}`}
              className="text-sm text-vivid-blue hover:underline"
            >
              Voir le rapport complet →
            </Link>
          </Card>

          <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
            <p className="label-uppercase text-muted">Suggestions</p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void send(s)}
                  disabled={loading}
                  className="rounded-lg border border-sand bg-paper px-3 py-2 text-left text-sm leading-relaxed text-ink transition-colors hover:bg-mist disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Message({ message }: { message: MentorMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-lg rounded-tr-sm border border-soft-ink bg-ink px-4 py-3 text-paper"
            : "max-w-[88%] rounded-lg rounded-tl-sm border border-sand bg-shell px-4 py-3 text-ink"
        }
      >
        {!isUser ? (
          <p className="label-uppercase mb-1.5 text-muted">Mentor</p>
        ) : null}
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg rounded-tl-sm border border-sand bg-shell px-4 py-3">
        <p className="label-uppercase mb-1.5 text-muted">Mentor</p>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
