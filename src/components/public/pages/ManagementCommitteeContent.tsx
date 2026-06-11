import { Users } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import {
  parseCommitteeContent,
  type CommitteeContent,
  type CommitteeOfficer,
} from "@/lib/cms/parse-committee";
import { cn } from "@/lib/utils";

function OfficerCard({ officer }: { officer: CommitteeOfficer }) {
  const isLead = officer.tier === "lead";

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-white px-4 py-5 sm:px-5",
        isLead
          ? "border-accent/45 shadow-[0_8px_24px_-12px_rgba(219,168,41,0.35)]"
          : "border-[var(--border)]"
      )}
    >
      {isLead && <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg bg-gold-nav" />}
      <p
        className={cn(
          "text-[10px] font-bold uppercase tracking-[0.16em]",
          isLead ? "text-accent" : "text-muted"
        )}
      >
        {officer.role}
      </p>
      <p
        className={cn(
          "mt-2 font-serif leading-snug text-primary",
          isLead ? "text-lg font-semibold sm:text-xl" : "text-base font-medium"
        )}
      >
        {officer.name}
      </p>
    </div>
  );
}

function CommitteeBoard({ data }: { data: CommitteeContent }) {
  const lead = data.officers.find((o) => o.tier === "lead");
  const otherOfficers = data.officers.filter((o) => o.tier !== "lead");

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{data.intro}</p>

      <section aria-labelledby="office-bearers-heading">
        <h2
          id="office-bearers-heading"
          className="font-serif text-xl font-semibold text-primary sm:text-2xl"
        >
          Office bearers
        </h2>
        <div className="mt-1 h-px w-12 bg-accent" />

        {lead && (
          <div className="mt-5">
            <OfficerCard officer={lead} />
          </div>
        )}

        {otherOfficers.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {otherOfficers.map((officer) => (
              <OfficerCard key={officer.role} officer={officer} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="committee-members-heading">
        <h3
          id="committee-members-heading"
          className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted"
        >
          Committee members
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.members.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2.5 border-l-2 border-accent/50 bg-[var(--cream)] px-3 py-2.5 text-sm font-medium text-primary"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

type ManagementCommitteeContentProps = {
  html: string;
  label: string;
  subtitle: string;
};

export function ManagementCommitteeContent({
  html,
  label,
  subtitle,
}: ManagementCommitteeContentProps) {
  const committee = parseCommitteeContent(html);

  if (!committee) return null;

  return (
    <>
      <header className="mb-8 border-b border-[var(--border)] pb-7">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient/25 text-primary">
            <Users className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="section-label">{label}</p>
            <p className="mt-2 text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>
          </div>
        </div>
      </header>

      <FadeIn delay={0.08}>
        <CommitteeBoard data={committee} />
      </FadeIn>
    </>
  );
}
