// Shared three.js stage for every 3D scene on the site. One place for the
// renderer, studio lighting, brand materials, resizing, pointer tilt, scroll
// progress and the pause-when-hidden loop, so each scene file only builds
// its objects and says how they move.
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'



// ── Brand palette (sampled from the logo) ──────────────────────────────
export const COLORS = {
  navy: 0x14235e,
  navySoft: 0x22357a,
  cyan: 0x14a3cb,
  gold: 0xd2a44c,
  white: 0xffffff,
  stone: 0xf3f1ec,
  glass: 0x9fc4e8,
  sage: 0x7f9a86,
}

export function materials() {
  return {
    navy: new THREE.MeshPhysicalMaterial({ color: COLORS.navy, roughness: 0.38, metalness: 0.1, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: 0.45 }),
    cyan: new THREE.MeshPhysicalMaterial({ color: COLORS.cyan, roughness: 0.38, metalness: 0.05, clearcoat: 0.45, clearcoatRoughness: 0.3, envMapIntensity: 0.35 }),
    white: new THREE.MeshPhysicalMaterial({ color: COLORS.white, roughness: 0.35, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.6 }),
    stone: new THREE.MeshStandardMaterial({ color: COLORS.stone, roughness: 0.75, metalness: 0, envMapIntensity: 0.5 }),
    gold: new THREE.MeshStandardMaterial({ color: COLORS.gold, roughness: 0.26, metalness: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({ color: COLORS.glass, roughness: 0.08, metalness: 0.1, clearcoat: 1, envMapIntensity: 1.1 }),
    glassNavy: new THREE.MeshPhysicalMaterial({ color: COLORS.navySoft, roughness: 0.1, metalness: 0.2, clearcoat: 1, envMapIntensity: 1 }),
    sage: new THREE.MeshStandardMaterial({ color: COLORS.sage, roughness: 0.8, metalness: 0 }),
    glow: new THREE.MeshStandardMaterial({ color: 0xfff1d0, emissive: 0xffd99a, emissiveIntensity: 0.55, roughness: 0.6 }),
  }
}

// ── Easing ─────────────────────────────────────────────────────────────
export const clamp01 = (t) => Math.min(Math.max(t, 0), 1)
export const easeOutCubic = (t) => 1 - Math.pow(1 - clamp01(t), 3)
export const easeInOutCubic = (t) => {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
export const easeOutBack = (t) => {
  const c = 1.4
  const x = clamp01(t) - 1
  return 1 + (c + 1) * x * x * x + c * x * x
}
export const damp = (current, target, lambda, dt) => current + (target - current) * (1 - Math.exp(-lambda * dt))

// ── Geometry helpers ──────────────────────────────────────────────────
export function roundedRectShape(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

// A softly bevelled box, centred, sitting on y = 0
export function slab(w, h, d, material, bevel = 0.03) {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w, d, Math.min(bevel * 2, w / 4, d / 4)), {
    depth: h - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 6,
  })
  g.rotateX(-Math.PI / 2)
  g.translate(0, bevel, 0)
  return new THREE.Mesh(g, material)
}

// Soft contact shadow: a radial gradient on a plane, no shadow maps needed
export function contactShadow(radius = 2, opacity = 0.32) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, `rgba(19,35,92,${opacity})`)
  g.addColorStop(0.55, `rgba(19,35,92,${opacity * 0.4})`)
  g.addColorStop(1, 'rgba(19,35,92,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const tex = new THREE.CanvasTexture(c)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
  )
  mesh.rotation.x = -Math.PI / 2
  mesh.renderOrder = -1
  return mesh
}

// ── Device capability ─────────────────────────────────────────────────
export function deviceProfile() {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.matchMedia('(max-width: 767px)').matches
  return {
    mobile: coarse || small,
    hover: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    dpr: Math.min(window.devicePixelRatio || 1, coarse || small ? 1.5 : 2),
  }
}

export function canRender3D() {
  try {
    if (navigator.connection?.saveData) return false
    if ((navigator.hardwareConcurrency ?? 4) < 4) return false
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'))
  } catch {
    return false
  }
}

/**
 * Creates the stage and runs a scene module.
 * scene(stage) must return { frame(t, dt), api?, dispose? }.
 * options.still  – render one settled frame and stop (reduced motion)
 * options.getProgress – () => 0..1, e.g. scroll progress through a section
 */
export function createStage(canvas, scene, { fov = 32, camera = [0, 0.1, 8.4], target = [0, 0, 0], still = false, getProgress } = {}) {
  const profile = deviceProfile()
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !profile.mobile || profile.dpr < 2, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(profile.dpr)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 0.9

  const threeScene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  threeScene.environment = envTex

  const cam = new THREE.PerspectiveCamera(fov, 1, 0.1, 100)
  cam.position.set(...camera)
  cam.lookAt(...target)

  threeScene.add(new THREE.AmbientLight(0xffffff, 0.35))
  const key = new THREE.DirectionalLight(0xfff6e8, 1.6)
  key.position.set(-3, 5, 5)
  threeScene.add(key)
  const rim = new THREE.DirectionalLight(0x9fdcff, 0.8)
  rim.position.set(4, 2, -4)
  threeScene.add(rim)

  // Pointer relative to the canvas centre, smoothed by each scene via stage.tilt
  const pointer = { x: 0, y: 0 }
  const tilt = { x: 0, y: 0 }
  const onPointer = (e) => {
    const r = canvas.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    pointer.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
    pointer.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
  }
  if (profile.hover && !still) window.addEventListener('pointermove', onPointer, { passive: true })

  const scrollProgress = () => {
    if (getProgress) return getProgress()
    const r = canvas.getBoundingClientRect()
    const vh = window.innerHeight
    return clamp01((vh - r.top) / (vh + r.height))
  }

  const stage = { scene: threeScene, camera: cam, renderer, key, rim, pointer, tilt, profile, still, scrollProgress, canvas }
  const instance = scene(stage)

  const clock = new THREE.Clock(false)
  let raf = 0
  let running = false
  let last = 0

  function render(t, dt) {
    tilt.x = damp(tilt.x, pointer.y, 4, dt)
    tilt.y = damp(tilt.y, pointer.x, 4, dt)
    instance.frame(t, dt)
    renderer.render(threeScene, cam)
  }
  function loop() {
    const t = clock.getElapsedTime()
    const dt = Math.min(t - last, 0.05)
    last = t
    render(t, dt)
    if (running) raf = requestAnimationFrame(loop)
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas
    if (!w || !h) return
    renderer.setSize(w, h, false)
    cam.aspect = w / h
    cam.updateProjectionMatrix()
    instance.resize?.(w, h)
    if (!running) render(still ? 99 : last, 0)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const start = () => {
    if (running || still) return
    running = true
    if (!clock.running) clock.start()
    raf = requestAnimationFrame(loop)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  let onScreen = true
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
    onScreen && !document.hidden ? start() : stop()
  })
  io.observe(canvas)
  const onVisibility = () => (onScreen && !document.hidden ? start() : stop())
  document.addEventListener('visibilitychange', onVisibility)

  resize()
  // Reduced motion: one settled frame (t far past every entrance)
  render(still ? 99 : 0, 0)
  start()

  return {
    api: instance.api,
    rerender: () => !running && render(still ? 99 : last, 0),
    dispose() {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      instance.dispose?.()
      threeScene.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose()
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => {
            m.map?.dispose()
            m.dispose()
          })
        }
      })
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
