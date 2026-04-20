import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Zap } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function AlertPanel() {
  const alerts = useStore((s) => s.alerts)
  const dismissAlert = useStore((s) => s.dismissAlert)

  return (
    <div className="absolute top-4 right-4 w-80 flex flex-col gap-2 z-10">
      <div className="flex items-center gap-2 mb-1">
        <Zap size={14} className="text-orange-400" />
        <span className="text-xs text-orange-400 font-semibold tracking-widest uppercase">
          Live Alerts
        </span>
        <span className="ml-auto text-xs text-slate-500">{alerts.length} active</span>
      </div>

      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className={`rounded-lg border px-3 py-2.5 backdrop-blur-md flex items-start gap-2 ${
              alert.severity === 'critical'
                ? 'bg-red-950/60 border-red-500/40 text-red-300'
                : 'bg-orange-950/60 border-orange-500/40 text-orange-300'
            }`}
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{alert.deviceName}</p>
              <p className="text-xs opacity-75 mt-0.5">{alert.message}</p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
