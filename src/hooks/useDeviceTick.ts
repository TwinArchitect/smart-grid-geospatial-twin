import { useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { tickDevices } from '@/core/mockDevices'

const ALERT_COOLDOWN_MS = 30_000

/** 每 2 秒随机游走设备数据，并在状态变化时推送告警 */
export function useDeviceTick() {
  const updateDevice = useStore((s) => s.updateDevice)
  const pushAlert = useStore((s) => s.pushAlert)
  const getDevices = () => useStore.getState().devices
  const cooldowns = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const interval = setInterval(() => {
      const current = getDevices()
      if (current.length === 0) return
      const updated = tickDevices(current)

      updated.forEach((d) => {
        updateDevice(d.id, d)

        const now = Date.now()
        const cooldownUntil = cooldowns.current.get(d.id) ?? 0

        if (d.status === 'critical' && now > cooldownUntil) {
          pushAlert({
            id: crypto.randomUUID(),
            deviceId: d.id,
            deviceName: d.name,
            severity: 'critical',
            message: `Critical fault detected. Temp: ${d.temperature.toFixed(1)}°C`,
            timestamp: now,
          })
          cooldowns.current.set(d.id, now + ALERT_COOLDOWN_MS)
        } else if (d.status === 'warning' && now > cooldownUntil) {
          pushAlert({
            id: crypto.randomUUID(),
            deviceId: d.id,
            deviceName: d.name,
            severity: 'warning',
            message: `Performance degraded. Power: ${d.power.toFixed(2)} MW`,
            timestamp: now,
          })
          cooldowns.current.set(d.id, now + ALERT_COOLDOWN_MS)
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [updateDevice, pushAlert])
}
