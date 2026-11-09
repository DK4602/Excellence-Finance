// Real-time 3D version of the Excellence Finance mark: a two-tone arrow
// (navy / cyan) holding four rising bars, on a gold chevron. Imperative
// three.js, loaded lazily by HeroMark3D so it never blocks the first paint.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const NAVY = 0x14235e
const CYAN = 0x14a3cb
const GOLD = 0xd2a44c

const EXTRUDE = { depth: 0.42, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 5, curveSegments: 8 }

function shape(points) {
  const s = new THREE.Shape()
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  return s
}

function extrude(points, material) {
  const g = new THREE.ExtrudeGeometry(shape(points), EXTRUDE)
  g.translate(0, 0, -EXTRUDE.depth / 2)
  return new THREE.Mesh(g, material)
}

const easeOutCubic = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3)
const easeOutBack = (t) => {
  const c = 1.4
  const x = Math.min(Math.max(t, 0), 1) - 1
  return 1 + (c + 1) * x * x * x + c * x * x
}

export function createBrandMark(canvas, { interactive = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 0.9

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 0.1, 8.4)

  // Lights: soft key from upper left, cool rim from behind right
  scene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-3, 4, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x9fdcff, 0.8)
  rim.position.set(4, 2, -4)
  scene.add(rim)

  const navy = new THREE.MeshPhysicalMaterial({ color: NAVY, roughness: 0.38, metalness: 0.1, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: 0.45 })
  const cyan = new THREE.MeshPhysicalMaterial({ color: CYAN, roughness: 0.38, metalness: 0.05, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: 0.35 })
  const white = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0, clearcoat: 0.4, envMapIntensity: 0.7 })
  const gold = new THREE.MeshStandardMaterial({ color: GOLD, roughness: 0.26, metalness: 0.9 })

  const mark = new THREE.Group()
  scene.add(mark)

  // Arrow, split down the middle like the logo: navy left, cyan right
  const left = [[-0.78, -1.42], [0, -1.06], [0, 1.62], [-1.3, 0.3], [-0.78, 0.3]]
  const right = left.map(([x, y]) => [-x, y]).reverse()
  mark.add(extrude(left, navy), extrude(right, cyan))

  // Gold chevron under the arrow
  mark.add(extrude([[-1.02, -1.6], [0, -1.22], [1.02, -1.6], [1.02, -1.9], [0, -1.52], [-1.02, -1.9]], gold))

  // Four white bars that grow upward from their base
  const bars = []
  const heights = [0.5, 0.82, 1.14, 1.5]
  heights.forEach((h, i) => {
    const geo = new THREE.BoxGeometry(0.24, h, 0.16, 1, 1, 1)
    geo.translate(0, h / 2, 0) // origin at the bottom so scale.y grows it upward
    const bar = new THREE.Mesh(geo, white)
    bar.position.set(-0.51 + i * 0.34, -0.98 + i * 0.02, EXTRUDE.depth / 2 + 0.09)
    bar.scale.y = 0.001
    mark.add(bar)
    bars.push(bar)
  })

  // ── Interaction and animation ────────────────────────────────────────
  const pointer = { x: 0, y: 0 }
  const tilt = { x: 0, y: 0 }
  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  if (interactive) window.addEventListener('pointermove', onPointer, { passive: true })

  const clock = new THREE.Clock()
  let raf = 0
  let running = false

  function frame() {
    const t = clock.getElapsedTime()

    // Entrance: rise, turn in and settle (1.4s), then bars grow in sequence
    const enter = easeOutCubic(t / 1.4)
    mark.position.y = -0.45 * (1 - enter) + Math.sin(t * 0.8) * 0.06 * enter
    const s = 0.82 + 0.18 * easeOutBack(t / 1.4)
    mark.scale.setScalar(s)
    bars.forEach((b, i) => {
      b.scale.y = Math.max(0.001, easeOutBack((t - 0.55 - i * 0.14) / 0.7))
    })

    // Idle sway plus a gentle tilt toward the pointer
    tilt.x += (pointer.y * 0.22 - tilt.x) * 0.05
    tilt.y += (pointer.x * 0.4 - tilt.y) * 0.05
    mark.rotation.y = -0.7 * (1 - enter) + Math.sin(t * 0.35) * 0.32 * enter + tilt.y
    mark.rotation.x = tilt.x

    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(frame)
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (!running) renderer.render(scene, camera)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const start = () => {
    if (running) return
    running = true
    clock.start()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  // Only animate while visible on screen and the tab is in front
  let onScreen = true
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    onScreen && !document.hidden ? start() : stop()
  })
  io.observe(canvas)
  const onVisibility = () => (onScreen && !document.hidden ? start() : stop())
  document.addEventListener('visibilitychange', onVisibility)

  frame() // draw the first frame immediately
  start()

  return function dispose() {
    stop()
    io.disconnect()
    ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointer)
    scene.traverse((o) => {
      if (o.isMesh) o.geometry.dispose()
    })
    ;[navy, cyan, white, gold].forEach((m) => m.dispose())
    envTex.dispose()
    pmrem.dispose()
    renderer.dispose()
  }
}
