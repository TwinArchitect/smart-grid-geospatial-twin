import { useEffect } from 'react'
import CesiumViewer from '@/components/viewer/CesiumViewer'
import AlertPanel from '@/components/panels/AlertPanel'
import DevicePanel from '@/components/panels/DevicePanel'
import Header from '@/components/ui/Header'
import { useStore } from '@/store/useStore'
import { generateDevices } from '@/core/mockDevices'
import { useDeviceTick } from '@/hooks/useDeviceTick'

const ION_TOKEN = import.meta.env.VITE_CESIUM_ION_TOKEN ?? ''

export default function App() {
  const setDevices = useStore((s) => s.setDevices)

  useEffect(() => {
    setDevices(generateDevices(300))
  }, [setDevices])

  useDeviceTick()

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <CesiumViewer ionToken={ION_TOKEN} />
      <Header />
      <AlertPanel />
      <DevicePanel />
    </div>
  )
}
