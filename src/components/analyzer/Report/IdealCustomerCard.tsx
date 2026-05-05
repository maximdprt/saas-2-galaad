import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import type { IdealCustomer } from "@/lib/types";

export function IdealCustomerCard({ icp }: { icp: IdealCustomer }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Client idéal"
        title={
          <>
            Le profil concret —{" "}
            <span className="font-serif-italic text-olive">acheteur, douleur, signaux</span>
          </>
        }
        description="Qui paie, pourquoi, où le trouver, ce qui le convainc, ce qui le bloque."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Acheteur · utilisateur</p>
          <p className="text-lg font-semibold leading-tight text-ink">
            {icp.buyer}
          </p>
          {icp.endUser ? (
            <p className="text-sm text-muted">
              Utilisateur final : {icp.endUser}
            </p>
          ) : null}
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Problème</p>
          <p className="text-sm leading-relaxed text-ink">{icp.problem}</p>
          <p className="label-uppercase mt-3 text-muted">Douleur principale</p>
          <p className="text-sm leading-relaxed text-ink">{icp.pain}</p>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-2">
          <p className="label-uppercase text-muted">Willingness to pay</p>
          <p className="text-sm leading-relaxed text-ink">
            {icp.willingnessToPay}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Où le trouver</p>
          <ul className="space-y-1.5 text-sm">
            {icp.whereToFind.map((w, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-olive" />
                {w}
              </li>
            ))}
          </ul>
          <p className="label-uppercase mt-4 text-muted">
            Signaux qu'il a vraiment le problème
          </p>
          <ul className="space-y-1.5 text-sm">
            {icp.signals.map((s, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-vivid-blue" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card surface="paper" elevation="1" radius="lg" className="space-y-3">
          <p className="label-uppercase text-muted">Ce qui peut le convaincre</p>
          <ul className="space-y-1.5 text-sm">
            {icp.convincers.map((c, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-fresh-green" />
                {c}
              </li>
            ))}
          </ul>
          <p className="label-uppercase mt-4 text-muted">Objections probables</p>
          <ul className="space-y-1.5 text-sm">
            {icp.objections.map((o, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-2 inline-block h-1 w-1 rounded-full bg-coral" />
                {o}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card surface="shell" elevation="flat" radius="lg">
          <p className="label-uppercase mb-3 text-muted">Segments à prioriser</p>
          <div className="flex flex-wrap gap-2">
            {icp.prioritySegments.map((s, i) => (
              <Tag key={i} tone="success">
                {s}
              </Tag>
            ))}
          </div>
        </Card>
        <Card surface="shell" elevation="flat" radius="lg">
          <p className="label-uppercase mb-3 text-muted">
            Segments à éviter au début
          </p>
          <div className="flex flex-wrap gap-2">
            {icp.avoidSegments.map((s, i) => (
              <Tag key={i} tone="warning">
                {s}
              </Tag>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
