type Props = {
  label: string;
  valueText: string;
  percent: number;
  barClassName: string;
};

export default function MetricBar({
  label,
  valueText,
  percent,
  barClassName,
}: Props) {
  const safePercent = Math.max(0, Math.min(percent, 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">{valueText}</span>
      </div>

      <div className="h-2.5 rounded-full bg-slate-100">
        <div
          className={`h-2.5 rounded-full ${barClassName}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}