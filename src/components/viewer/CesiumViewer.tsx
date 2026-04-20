import { useEffect, useRef } from 'react'
import * as Cesium from 'cesium'
import { useStore } from '@/store/useStore'
import type { Device } from '@/types'

// 设备状态对应颜色
const STATUS_COLOR: Record<string, Cesium.Color> = {
  normal:   Cesium.Color.fromCssColorString('#22c55e'),
  warning:  Cesium.Color.fromCssColorString('#f97316'),
  critical: Cesium.Color.fromCssColorString('#ef4444'),
  offline:  Cesium.Color.fromCssColorString('#6b7280'),
}

interface Props {
  ionToken: string
}

export default function CesiumViewer({ ionToken }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Cesium.Viewer | null>(null)
  const entitiesRef = useRef<Map<string, Cesium.Entity>>(new Map())

  const devices = useStore((s) => s.devices)
  const setSelectedDevice = useStore((s) => s.setSelectedDevice)
  const setLoaded = useStore((s) => s.setLoaded)

  // 初始化 Cesium Viewer
  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return

    Cesium.Ion.defaultAccessToken = ionToken

    const viewer = new Cesium.Viewer(containerRef.current, {
      baseLayerPicker: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      geocoder: false,
      homeButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      timeline: false,
      animation: false,
      // 不传 terrainProvider，使用 Cesium 默认（WGS84 椭球）
      creditContainer: document.createElement('div'),
    })

    // 深色星空背景
    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a0e1a')
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0f172a')
    viewer.scene.globe.enableLighting = true

    // 添加 Bing 卫星底图（异步，需确认 viewer 仍存活）
    Cesium.IonImageryProvider.fromAssetId(2).then((provider) => {
      if (!viewer.isDestroyed()) {
        viewer.imageryLayers.addImageryProvider(provider)
      }
    }).catch(() => {
      // token 无效时静默降级，地球仍可显示默认底图
    })

    // 点击事件：选中设备
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = viewer.scene.pick(event.position)
      if (Cesium.defined(picked) && picked.id instanceof Cesium.Entity) {
        const deviceId = picked.id.properties?.getValue(Cesium.JulianDate.now())?.deviceId
        if (deviceId) setSelectedDevice(deviceId)
      } else {
        setSelectedDevice(null)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    viewerRef.current = viewer
    entitiesRef.current = new Map()
    setLoaded(true)

    return () => {
      handler.destroy()
      if (!viewer.isDestroyed()) viewer.destroy()
      viewerRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ionToken])

  // 同步设备点位到 Cesium entities
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || viewer.isDestroyed() || devices.length === 0) return

    const existing = entitiesRef.current

    devices.forEach((device: Device) => {
      const color = STATUS_COLOR[device.status] ?? STATUS_COLOR.normal
      const heightScale = (device.power / 5) * 80000 // 高度映射发电量

      if (existing.has(device.id)) {
        // 更新已有 entity
        const entity = existing.get(device.id)!
        const cylinder = entity.cylinder
        if (cylinder) {
          cylinder.material = new Cesium.ColorMaterialProperty(color.withAlpha(0.85))
          cylinder.length = new Cesium.ConstantProperty(heightScale)
          cylinder.topRadius = new Cesium.ConstantProperty(heightScale / 2)
          cylinder.bottomRadius = new Cesium.ConstantProperty(heightScale / 2)
        }
      } else {
        // 新建 entity
        const entity = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(device.lng, device.lat, heightScale / 2),
          cylinder: {
            length: heightScale,
            topRadius: heightScale / 2,
            bottomRadius: heightScale / 2,
            material: new Cesium.ColorMaterialProperty(color.withAlpha(0.85)),
            outline: true,
            outlineColor: color.brighten(0.4, new Cesium.Color()),
            outlineWidth: 1,
          },
          properties: new Cesium.PropertyBag({ deviceId: device.id }),
        })
        existing.set(device.id, entity)
      }
    })
  }, [devices])

  // 选中设备时飞入
  const selectedId = useStore((s) => s.selectedDeviceId)
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || !selectedId) return
    const device = devices.find((d) => d.id === selectedId)
    if (!device) return

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(device.lng, device.lat, 200000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 1.5,
    })
  }, [selectedId, devices])

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: 'absolute', inset: 0 }}
    />
  )
}
