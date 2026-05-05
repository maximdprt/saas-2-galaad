import Link from "next/link";
import { Analyzer } from "@/components/analyzer/Analyzer";

export default function Home() {
  return (
    <div className="bg-paper">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1440px] border-b border-sand px-5 pb-16 pt-16 sm:px-8 lg:px-14 lg:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">

          {/* Left — editorial title */}
          <div>
            <p className="label-uppercase text-gold animate-fade-up">
              Bizroast — Analyse honnête
            </p>
            <h1 className="mt-6 text-[clamp(2.8rem,7vw,6rem)] font-semibold leading-[1.0] tracking-tight text-ink animate-fade-up delay-100">
              Teste ton idée{" "}
              <span className="font-serif-italic font-normal text-olive">
                honnêtement
              </span>
              .{" "}
              <br className="hidden sm:block" />
              Pas de flatterie.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted animate-fade-up delay-200">
              Décris ton idée. L&apos;IA joue l&apos;analyste exigeant et le contradicteur.
              Risques, marché, monétisation, Go/No-Go : un rapport complet, sans bullshit.
            </p>
          </div>

          {/* Right — numbered process blocks */}
          <div className="border border-sand animate-clip-reveal delay-300">
            <div className="border-b border-sand px-6 py-4">
              <p className="label-uppercase text-muted">Méthode</p>
            </div>
            <ol>
              <Step n="01" title="Décris l'idée" body="Clavier ou voix. Cible, problème, solution, géo." />
              <Step n="02" title="L'IA analyse" body="Risques, marché, concurrence, ICP, monétisation." />
              <Step n="03" title="Lis le rapport" body="Go/No-Go, plan MVP, plan de validation 48h." />
            </ol>
          </div>
        </div>
      </section>

      {/* ── Input ────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-14">
        <Analyzer />
        <p className="mt-5 text-xs text-muted">
          Tes analyses sont enregistrées localement.{" "}
          <Link href="/history" className="text-vivid-blue hover:underline">
            Voir l&apos;historique
          </Link>
          .
        </p>
      </section>

      {/* ── Dark metric band ─────────────────────────────────── */}
      <section className="border-y border-soft-ink bg-ink">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 lg:px-14">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-soft-ink">
            <Metric n="7" label="Scores de risque calibrés" />
            <Metric n="10+" label="Sections dans chaque rapport" />
            <Metric n="0" label="Bullshit. Toujours." />
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1440px] border-b border-sand px-5 py-16 sm:px-8 lg:px-14">
        <p className="label-uppercase text-muted">Ce que tu obtiens</p>
        <div className="mt-8 grid gap-0 border border-sand sm:grid-cols-2">
          <Feature
            n="01"
            title="Scores de risque"
            body="7 dimensions évaluées séparément : marché, concurrence, technique, financement, exécution, légal, timing."
          />
          <Feature
            n="02"
            title="Profil client idéal"
            body="ICP précis : qui souffre, combien ça coûte, comment les trouver, comment les convaincre."
          />
          <Feature
            n="03"
            title="Monétisation testée"
            body="Comparaison de 3 à 6 modèles économiques avec pros, cons, complexité et recommandation."
          />
          <Feature
            n="04"
            title="Plan de validation"
            body="Scripts LinkedIn, questions terrain, landing test, seuils de décision : continue, pivot, stop."
          />
        </div>
      </section>

    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-5 border-b border-sand px-6 py-5 last:border-b-0">
      <span className="mt-0.5 font-mono text-xs font-semibold text-gold">{n}</span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </li>
  );
}

function Metric({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex flex-col gap-2 px-0 sm:px-10 first:pl-0 last:pr-0">
      <span className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-tight text-paper">
        {n}
      </span>
      <span className="label-uppercase text-muted-light">{label}</span>
    </div>
  );
}

function Feature({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="border-b border-r border-sand p-8 transition-colors hover:bg-shell [&:nth-child(2)]:border-r-0 [&:nth-child(4)]:border-b-0 [&:nth-child(4)]:border-r-0 sm:[&:nth-child(3)]:border-b-0">
      <span className="font-mono text-xs font-semibold text-gold">{n}</span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
