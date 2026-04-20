import { create } from 'zustand'
import type { AppState, AlertEntry, Device } from '@/types'

const ALERT_MAX = 5

export const useStore = create<AppState>((set) => ({
  devices: [],
  alerts: [],
  selectedDeviceId: null,
  isLoaded: false,

  setDevices: (devices) => set({ devices }),

  updateDevice: (id, patch) =>
    set((state) => ({
      devices: state.devices.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),

  pushAlert: (alert: AlertEntry) =>
    set((state) => {
      const next = [...state.alerts, alert]
      return { alerts: next.length > ALERT_MAX ? next.slice(next.length - ALERT_MAX) : next }
    }),

  dismissAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),

  setSelectedDevice: (id) => set({ selectedDeviceId: id }),

  setLoaded: (v) => set({ isLoaded: v }),
}))
