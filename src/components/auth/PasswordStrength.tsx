export function getPasswordScore(password: string) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

export function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordScore(password);
  const label = score < 3 ? "Lemah" : score < 5 ? "Sedang" : "Kuat";
  return (
    <div aria-live="polite">
      <div className="mt-2 grid grid-cols-5 gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full ${i < score ? (score < 3 ? "bg-destructive" : score < 5 ? "bg-secondary" : "bg-primary") : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Kekuatan password: <span className="font-semibold">{label}</span>
      </p>
    </div>
  );
}
