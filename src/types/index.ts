export type DeviceStatus = 'normal' | 'warning' | 'critical' | 'offline'

export interface Device {
  id: string
  name: string
  type: 'wind_turbine' | 'solar_panel' | 'substation' | 'pipeline'
  lat: number
  lng: number
  status: DeviceStatus
  power: number       // MW
  temperature: number // °C
  pressure?: number   // bar（管道专用）
  updatedAt: number
}

export interface AlertEntry {
  id: string
  deviceId: string
  deviceName: string
  severity: 'warning' | 'critical'
  message: string
  timestamp: number
}

export interface AppState {
  devices: Device[]
  alerts: AlertEntry[]
  selectedDeviceId: string | null
  isLoaded: boolean
  setDevices: (devices: Device[]) => void
  updateDevice: (id: string, patch: Partial<Device>) => void
  pushAlert: (alert: AlertEntry) => void
  dismissAlert: (id: string) => void
  setSelectedDevice: (id: string | null) => void
  setLoaded: (v: boolean) => void
}
