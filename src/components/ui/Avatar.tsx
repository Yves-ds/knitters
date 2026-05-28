interface AvatarProps { src?: string; name: string; size?: 'sm' | 'md' | 'lg' }
const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base' }
export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  return (
    <div className={`${sizeMap[size]} rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary font-bold flex-shrink-0`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span>{name.slice(0,1)}</span>}
    </div>
  )
}
