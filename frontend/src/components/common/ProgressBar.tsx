type Props = {
  value: number;
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label ?? "Progreso"}</span>
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

