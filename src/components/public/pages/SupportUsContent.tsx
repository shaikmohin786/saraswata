import { BookOpen } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { DonationBankDetails } from "@/components/public/pages/DonationBankDetails";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";

const DEFAULT_BANK =
  "SARASWATA NIKETANAM, ICICI BANK SB A/C NO: 238601000267 CHIRALA BRANCH IFSC CODE : ICIC0002386";

function stripTags(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractParagraphs(html: string) {
  const sanitized = sanitizeCmsHtml(html);
  const fromTags = [...sanitized.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean);

  if (fromTags.length > 0) return fromTags;

  const plain = stripTags(sanitized);
  return plain ? plain.split(/\n+/).map((s) => s.trim()).filter(Boolean) : [];
}

function partitionContent(html: string) {
  const paragraphs = extractParagraphs(html);
  const narrative: string[] = [];
  let bankDetails: string | null = null;
  let bookNote: string | null = null;

  for (const paragraph of paragraphs) {
    if (/bank details are given below/i.test(paragraph)) continue;

    if (/icici|ifsc|a\/c no|account no/i.test(paragraph)) {
      bankDetails = paragraph;
      continue;
    }

    if (/donations in the form of books/i.test(paragraph)) {
      bookNote = paragraph;
      continue;
    }

    narrative.push(paragraph);
  }

  return {
    narrative,
    bankDetails: bankDetails ?? DEFAULT_BANK,
    bookNote: bookNote ?? "We also accept donations in the form of books.",
  };
}

function formatBankLine(line: string) {
  const normalized = line.replace(/\s*,\s*/g, ", ").replace(/\s+/g, " ").trim();

  const account = normalized.match(/A\/C NO:?\s*(\d+)/i)?.[1];
  const ifsc = normalized.match(/IFSC CODE\s*:?\s*(\S+)/i)?.[1];

  return {
    accountHolder: "Saraswata Niketanam",
    bank: "ICICI Bank",
    branch: "Chirala Branch",
    accountNo: account ?? "238601000267",
    ifsc: ifsc ?? "ICIC0002386",
  };
}

type SupportUsContentProps = {
  title?: string;
  html: string;
};

export function SupportUsContent({ title = "Support Us", html }: SupportUsContentProps) {
  const { narrative, bankDetails, bookNote } = partitionContent(html);
  const bank = formatBankLine(bankDetails);

  return (
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <header>
          <p className="section-label">Donate</p>
          <h1 className="mt-2 font-serif text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight text-primary">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Help preserve a century of books, manuscripts, and Gandhian heritage for generations
            yet to come.
          </p>
          <div className="mt-5 accent-line" />
        </header>
      </FadeIn>

      <FadeIn delay={0.05}>
        <DonationBankDetails bank={bank} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-10 space-y-4 text-[1.0625rem] leading-[1.8] text-foreground/90">
          {narrative.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.14}>
        <div className="mt-8 flex items-start gap-3 border-t border-[var(--border)] pt-8">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-accent/80" strokeWidth={1.5} />
          <div>
            <p className="text-base leading-relaxed text-muted">{bookNote}</p>
            <p className="mt-5 font-serif text-primary">
              With gratitude,{" "}
              <span className="font-semibold">Saraswata Niketanam</span>
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
