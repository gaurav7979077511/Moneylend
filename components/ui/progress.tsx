export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
