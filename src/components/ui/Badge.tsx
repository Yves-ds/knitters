interface BadgeProps { label: string; variant?: 'default' | 'primary' | 'success' | 'warning' }
const variantMap = {
  default: 'bg-bg-light text-sub',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-green-50 text-green-600',
  warning: 'bg-yellow-50 text-yellow-600',
}
export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${variantMap[variant]}`}>{label}</span>
}
