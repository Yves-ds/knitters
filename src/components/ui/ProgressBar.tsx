interface ProgressBarProps { value: number; showLabel?: boolean }
export default function ProgressBar({ value, showLabel }: ProgressBarProps) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-sub">진행률</span>
          <span className="text-xs font-semibold text-primary">{value}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-bg-light rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
