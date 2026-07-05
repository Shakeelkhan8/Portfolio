type FormMessageProps = {
  error?: string;
  success?: string;
};

export function FormMessage({ error, success }: FormMessageProps) {
  if (!error && !success) return null;

  if (error) {
    return (
      <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <p className="rounded-lg border border-success/20 bg-success-muted px-3 py-2 text-sm text-foreground">
      {success}
    </p>
  );
}
