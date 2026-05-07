import Link from "next/link";
import { Analyzer } from "@/components/analyzer/Analyzer";

export default function Home() {
  return (
    <div className="bg-paper">
      <section className="border-b border-sand bg-paper text-ink">
        <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-12 lg:py-16">
          <div className="max-w-3xl">
            <p className="label-uppercase text-coral">
              Noyau / analyse d&apos;idee
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.92] tracking-normal">
              Garde ce
              <br />
              qui tient.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Decris ton SaaS, ton offre ou ton projet. Noyau trie le signal :
              verdict, risques, client ideal, prix, MVP et plan terrain.
            </p>
          </div>

          <div className="self-end border border-sand bg-shell text-ink">
            <div className="border-b border-sand px-5 py-4">
              <p className="label-uppercase text-muted">Chemin court</p>
            </div>
            <ol>
              <Step
                n="01"
                title="Pose"
                body="Cible, probleme, solution, prix, contexte."
              />
              <Step
                n="02"
                title="Trie"
                body="Hypotheses, risques, preuves manquantes."
              />
              <Step
                n="03"
                title="Agis"
                body="Go, pivot ou coupe avec plan 48h."
              />
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1320px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-12 lg:py-12">
        <div>
          <Analyzer />
          <p className="mt-4 text-sm text-muted">
            Les rapports restent dans ce navigateur.{" "}
            <Link
              href="/history"
              className="font-semibold text-vivid-blue underline decoration-coral decoration-2 underline-offset-4"
            >
              Voir l&apos;historique
            </Link>
            .
          </p>
        </div>

        <aside className="border border-sand bg-shell p-5">
          <p className="label-uppercase text-muted">Sortie claire</p>
          <div className="mt-5 grid gap-4">
            <Metric n="1" label="verdict lisible" />
            <Metric n="7" label="risques notes" />
            <Metric n="48h" label="actions terrain" />
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-[1320px] border-t border-sand px-5 py-10 sm:px-8 lg:px-12">
        <p className="label-uppercase text-muted">Dans le noyau du rapport</p>
        <div className="mt-6 grid border border-sand bg-shell sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Decision"
            body="Go, go sous conditions, pivot, no-go ou idee trop floue."
          />
          <Feature
            title="Risques"
            body="Marche, concurrence, technique, legal, timing, budget, execution."
          />
          <Feature
            title="Modele"
            body="Monetisation, pricing, benchmark et recommandation."
          />
          <Feature
            title="Terrain"
            body="MVP, questions clients et prochaines actions mesurables."
          />
        </div>
      </section>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-4 border-b border-sand px-5 py-4 last:border-b-0">
      <span className="mt-0.5 font-mono text-xs font-semibold text-coral">
        {n}
      </span>
      <div>
        <p className="font-bold uppercase text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </li>
  );
}

function Metric({ n, label }: { n: string; label: string }) {
  return (
    <div className="border-b border-sand pb-4 last:border-b-0 last:pb-0">
      <span className="block text-4xl font-bold leading-none text-ink">{n}</span>
      <span className="mt-1 block text-sm font-semibold uppercase text-muted">
        {label}
      </span>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-b border-sand p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
      <h3 className="text-base font-bold uppercase text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
