import clsx from "clsx";

export const PageShell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element => (
  <div
    className={clsx(
      "flex flex-col w-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

export const PageLoading = ({
  message = "Chargement…",
}: {
  message?: string;
}): JSX.Element => (
  <PageShell>
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-brand-green/25 border-t-brand-green"
        role="status"
        aria-label={message}
      />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </PageShell>
);

export const PageError = ({
  message = "Une erreur est survenue lors du chargement.",
}: {
  message?: string;
}): JSX.Element => (
  <PageShell>
    <div className="flex flex-col items-center justify-center gap-2 px-8 py-24 text-center">
      <p className="text-sm font-medium text-destructive">Erreur</p>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  </PageShell>
);
