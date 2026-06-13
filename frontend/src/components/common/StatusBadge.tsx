type Props = {
  value: string;
};

export function StatusBadge({ value }: Props) {
  return <span className={`status-badge status-${value}`}>{value.replace(/_/g, " ")}</span>;
}
