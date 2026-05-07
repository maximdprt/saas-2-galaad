import Link from "next/link";
import { Analyzer } from "@/components/analyzer/Analyzer";

export default function Home() {
  return (
    <div className="bg-paper">
      <section className="border-b border-ink bg-ink text-paper">
        <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-12 lg:py-16">
          <div className="max-w-3xl">
            <p className="label-uppercase text-gold">
              Bizroast / business stress test
            </p>
            <h1 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-bold uppercase leading-[0.92] tracking-normal">
              Teste l&apos;idee.
              <br />
              Coupe le bruit.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-light sm:text-lg">
              Decris ton SaaS, ton offre ou ton idee business. L&apos;IA sort un
              verdict, les risques, le client ideal, le prix, le MVP et les
              actions terrain a lancer maintenant.
            </p>
          </div>

          <div className="self-end border border-soft-ink bg-paper text-ink">
            <div className="border-b border-sand px-5 py-4">
              <p className="label-uppercase text-muted">Process simple</p>
            </div>
            <ol>
              <Step
                n="01"
                title="Explique"
                body="Cible, probleme, solution, prix, zone."
              />
              <Step
                n="02"
                title="Analyse"
                body="Marche, concurrence, execution, risques."
              />
              <Step
                n="03"
                title="Decide"
                body="Go, pivot ou stop avec plan 48h."
              />
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1320px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-12 lg:py-12">
        <div>
          <Analyzer />
          <p className="mt-4 text-sm text-muted">
            Stockage local dans ce navigateur.{" "}
            <Link
              href="/history"
              className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4"
            >
              Voir l&apos;historique
            </Link>
            .
          </p>
        </div>

        <aside className="border border-sand bg-shell p-5">
          <p className="label-uppercase text-muted">Rapport genere</p>
          <div className="mt-5 grid gap-4">
            <Metric n="7" label="risques notes" />
            <Metric n="10+" label="blocs utiles" />
            <Metric n="48h" label="plan terrain" />
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-[1320px] border-t border-sand px-5 py-10 sm:px-8 lg:px-12">
        <p className="label-uppercase text-muted">Ce qui sort du test</p>
        <div className="mt-6 grid border border-sand sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Verdict"
            body="Go, go sous conditions, pivot, no-go ou idee trop floue."
          />
          <Feature
            title="Risques"
            body="Marche, concurrence, technique, legal, timing, budget, execution."
          />
          <Feature
            title="Monetisation"
            body="Modeles, pricing, benchmark et recommandation."
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
