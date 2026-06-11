type AnalyticsScriptProps = { code?: string | null };

export function AnalyticsScript({ code }: AnalyticsScriptProps) {
  if (!code?.trim()) return null;
  return (
    <div
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
