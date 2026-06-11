"use client";

import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type BankDetails = {
  accountHolder: string;
  bank: string;
  branch: string;
  accountNo: string;
  ifsc: string;
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback ignored */
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
        copied
          ? "border-green-600/30 bg-green-50 text-green-800"
          : "border-[var(--border)] bg-white text-primary hover:border-accent/50 hover:text-accent"
      )}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}

function DetailRow({
  label,
  value,
  mono,
  copyValue,
  copyLabel,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyValue?: string;
  copyLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-[var(--border)] py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0 sm:flex sm:flex-1 sm:items-baseline sm:gap-6">
        <dt className="shrink-0 text-xs font-medium text-muted sm:w-36">{label}</dt>
        <dd
          className={cn(
            "mt-0.5 break-all text-sm text-primary sm:mt-0 sm:flex-1",
            mono && "font-mono text-base font-semibold tracking-wide"
          )}
        >
          {value}
        </dd>
      </div>
      {copyValue && copyLabel && (
        <CopyButton value={copyValue} label={copyLabel} />
      )}
    </div>
  );
}

export function DonationBankDetails({ bank }: { bank: BankDetails }) {
  const allDetails = [
    `Beneficiary: ${bank.accountHolder}`,
    `Bank: ${bank.bank}`,
    `Branch: ${bank.branch}`,
    `Account No: ${bank.accountNo}`,
    `IFSC: ${bank.ifsc}`,
  ].join("\n");

  const [allCopied, setAllCopied] = useState(false);

  const copyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(allDetails);
      setAllCopied(true);
      window.setTimeout(() => setAllCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [allDetails]);

  return (
    <section aria-labelledby="donate-bank-heading" className="mt-8">
      <h2
        id="donate-bank-heading"
        className="font-serif text-xl font-semibold text-primary sm:text-[1.35rem]"
      >
        Bank transfer details
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Use the account details below to send your donation. You can copy the account number or IFSC code with one tap.
      </p>

      <div className="mt-5 overflow-hidden rounded-lg border border-[var(--border)] bg-white">
        <dl className="px-4 sm:px-5">
          <DetailRow label="Beneficiary name" value={bank.accountHolder} />
          <DetailRow label="Bank" value={bank.bank} />
          <DetailRow label="Branch" value={bank.branch} />
          <DetailRow
            label="Account number"
            value={bank.accountNo}
            mono
            copyValue={bank.accountNo}
            copyLabel="account number"
          />
          <DetailRow
            label="IFSC code"
            value={bank.ifsc}
            mono
            copyValue={bank.ifsc}
            copyLabel="IFSC code"
          />
        </dl>

        <div className="border-t border-[var(--border)] bg-[var(--cream)] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={copyAll}
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-colors hover:text-accent"
          >
            {allCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-700" />
                All details copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy all bank details
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
