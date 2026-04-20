import { Activity } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Header() {
  const devices = useStore((s) => s.devices)
  const normal   = devices.filter((d) => d.status === 'normal').length
  const warning  = devices.filter((d) => d.status === 'warning').length
  const critical = devices.filter((d) => d.status === 'critical').length
  const offline  = devices.filter((d) => d.status === 'offline').length

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10
      bg-slate-900/80 backdrop-blur-md border border-slate-700/50
      rounded-full px-5 py-2.5 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Activity size={14} className="text-cyan-400" />
        <span className="text-white text-sm font-semibold tracking-wide">
          Energy Infrastructure Monitor
        </span>
      </div>
      <div className="w-px h-4 bg-slate-700" />
      <div className="flex items-center gap-3 text-xs">
        <Dot color="bg-green-400" label={`${normal} Normal`} />
        <Dot color="bg-orange-400" label={`${warning} Warn`} />
        <Dot color="bg-red-400" label={`${critical} Critical`} />
        <Dot color="bg-slate-500" label={`${offline} Offline`} />
      </div>
    </div>
  )
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-300">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  )
}
