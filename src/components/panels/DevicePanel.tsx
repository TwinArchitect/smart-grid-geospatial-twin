import { motion, AnimatePresence } from 'framer-motion'
import { X, Thermometer, Gauge, Zap, Wifi, WifiOff } from 'lucide-react'
import { useStore } from '@/store/useStore'

const STATUS_LABEL: Record<string, string> = {
  normal: 'Normal',
  warning: 'Warning',
  critical: 'Critical',
  offline: 'Offline',
}

const STATUS_CLASS: Record<string, string> = {
  normal:   'text-green-400 bg-green-400/10 border-green-400/30',
  warning:  'text-orange-400 bg-orange-400/10 border-orange-400/30',
  critical: 'text-red-400 bg-red-400/10 border-red-400/30',
  offline:  'text-slate-400 bg-slate-400/10 border-slate-400/30',
}

export default function DevicePanel() {
  const selectedId = useStore((s) => s.selectedDeviceId)
  const devices = useStore((s) => s.devices)
  const setSelectedDevice = useStore((s) => s.setSelectedDevice)

  const device = devices.find((d) => d.id === selectedId)

  return (
    <AnimatePresence>
      {device && (
        <motion.div
          key={device.id}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-72 z-10
            bg-slate-900/80 backdrop-blur-md border border-slate-700/50
            rounded-xl p-4 flex flex-col gap-3"
        >
          {/* 头部 */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest">
                {device.type.replace('_', ' ')}
              </p>
              <h3 className="text-white font-semibold mt-0.5 capitalize">{device.name}</h3>
            </div>
            <button
              onClick={() => setSelectedDevice(null)}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* 状态徽标 */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit ${STATUS_CLASS[device.status]}`}>
            {device.status === 'offline' ? <WifiOff size={11} /> : <Wifi size={11} />}
            {STATUS_LABEL[device.status]}
          </div>

          {/* 数据指标 */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Metric icon={<Zap size={13} />} label="Power" value={`${device.power.toFixed(2)} MW`} />
            <Metric icon={<Thermometer size={13} />} label="Temp" value={`${device.temperature.toFixed(1)} °C`} />
            {device.pressure != null && (
              <Metric icon={<Gauge size={13} />} label="Pressure" value={`${device.pressure.toFixed(2)} bar`} />
            )}
            <Metric icon={null} label="Updated" value={new Date(device.updatedAt).toLocaleTimeString()} />
          </div>

          {/* 坐标 */}
          <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-2">
            {device.lat.toFixed(4)}°N, {device.lng.toFixed(4)}°E
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-800/60 rounded-lg px-3 py-2">
      <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-white text-sm font-mono font-medium">{value}</p>
    </div>
  )
}
