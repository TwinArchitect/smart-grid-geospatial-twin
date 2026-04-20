import type { Device, DeviceStatus } from '@/types'

const TYPES = ['wind_turbine', 'solar_panel', 'substation', 'pipeline'] as const

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randStatus(): DeviceStatus {
  const r = Math.random()
  if (r < 0.75) return 'normal'
  if (r < 0.88) return 'warning'
  if (r < 0.95) return 'critical'
  return 'offline'
}

/** 生成围绕中心点 (lat, lng) 散布的 count 个设备 */
export function generateDevices(
  count = 300,
  centerLat = 39.9,
  centerLng = 116.4,
  spread = 3,
): Device[] {
  return Array.from({ length: count }, (_, i) => {
    const type = TYPES[i % TYPES.length]
    return {
      id: `dev-${i}`,
      name: `${type.replace('_', ' ')} #${i + 1}`,
      type,
      lat: centerLat + rand(-spread, spread),
      lng: centerLng + rand(-spread, spread),
      status: randStatus(),
      power: rand(0.5, 5),
      temperature: rand(20, 80),
      pressure: type === 'pipeline' ? rand(2, 8) : undefined,
      updatedAt: Date.now(),
    }
  })
}

/** 每秒随机游走设备数据，模拟实时传感器 */
export function tickDevices(devices: Device[]): Device[] {
  return devices.map((d) => {
    if (d.status === 'offline') return d
    return {
      ...d,
      power: Math.max(0, d.power + rand(-0.1, 0.1)),
      temperature: Math.max(10, Math.min(100, d.temperature + rand(-0.5, 0.5))),
      pressure: d.pressure != null
        ? Math.max(1, Math.min(10, d.pressure + rand(-0.05, 0.05)))
        : undefined,
      updatedAt: Date.now(),
    }
  })
}
