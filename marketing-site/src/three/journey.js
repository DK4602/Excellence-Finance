// Homepage process: an application card travels a gold path through four
// stations as the visitor scrolls the section. The path runs from the back
// of the stage to the front, so in the tall panel beside the step rail the
// card moves down the screen, one station per step. The last station is the
// lender's decision (a neutral seal), never an approval.
import * as THREE from 'three'
import { createStage, materials, slab, roundedRectShape, contactShadow, damp, easeOutCubic, clamp01 } from './runtime'

// Stations alternate left and right down the stage so none hides another
const STATIONS = [[1.1, -2.85], [-1.1, -0.95], [1.1, 0.95], [-1.1, 2.85]]

// Arc-length position (0..1) on the curve nearest a point
function nearestU(curve, x, z) {
  let best = 0
  let bestD = Infinity
  for (let i = 0; i <= 600; i++) {
    const u = i / 600
    const p = curve.getPointAt(u)
    const d = (p.x - x) ** 2 + (p.z - z) ** 2
    if (d < bestD) {
      bestD = d
      best = u
    }
  }
  return best
}

function upright(w, h, d, mat, r = 0.08) {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(w, h, r), { depth: d, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 })
  g.translate(0, h / 2, -d / 2)
  return new THREE.Mesh(g, mat)
}

function scene(stage) {
  const m = materials()
  const root = new THREE.Group()
  stage.scene.add(root)

  // Path: back (top of the panel) to front (bottom), zigzagging through
  // each station
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0, -3.9),
    ...STATIONS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    new THREE.Vector3(-0.2, 0, 3.9),
  ])
  const STOPS = STATIONS.map(([x, z]) => nearestU(curve, x, z))
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.028, 10, false), m.gold)
  tube.position.y = 0.03
  root.add(tube)
  const ribbon = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.16, 12, false), m.white)
  ribbon.scale.y = 0.15
  root.add(ribbon)

  // Stations
  const station = (u, build) => {
    const g = new THREE.Group()
    const p = curve.getPointAt(u)
    g.position.copy(p)
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.08, 48), m.white)
    pad.position.y = 0.04
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.018, 8, 64), m.gold)
    rim.rotation.x = Math.PI / 2
    rim.position.y = 0.08
    const obj = new THREE.Group()
    obj.position.y = 0.08
    build(obj)
    obj.userData.base = 1.3
    obj.scale.setScalar(1.3)
    g.add(pad, rim, obj)
    root.add(g)
    return { g, obj }
  }

  const stations = [
    // 1 Share your requirements: two speech bubbles
    station(STOPS[0], (o) => {
      const a = upright(0.72, 0.46, 0.1, m.white)
      a.position.set(-0.12, 0.12, 0)
      const tailA = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 3), m.white)
      tailA.position.set(-0.32, 0.1, 0)
      tailA.rotation.z = Math.PI
      ;[-0.22, -0.06, 0.1].forEach((x) => {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), m.gold)
        dot.position.set(x, 0.35, 0.07)
        o.add(dot)
      })
      const b = upright(0.5, 0.32, 0.1, m.navy)
      b.position.set(0.22, 0.58, -0.12)
      o.add(a, tailA, b)
    }),
    // 2 Explore loan options: a fan of lender cards
    station(STOPS[1], (o) => {
      ;[-1, 0, 1].forEach((k) => {
        const c = upright(0.56, 0.36, 0.035, k === 0 ? m.navy : m.white, 0.05)
        c.position.set(k * 0.16, 0.06 + (1 - Math.abs(k)) * 0.06, -Math.abs(k) * 0.05)
        c.rotation.z = -k * 0.22
        o.add(c)
      })
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.01), m.gold)
      strip.position.set(0, 0.3, 0.04)
      o.add(strip)
    }),
    // 3 Get expert assistance: documents receive a check
    station(STOPS[2], (o) => {
      ;[0, 1, 2].forEach((i) => {
        const s = slab(0.6, 0.03, 0.78, m.white, 0.008)
        s.position.set(i * 0.03, 0.04 + i * 0.045, -i * 0.03)
        s.rotation.y = (i - 1) * 0.12
        o.add(s)
      })
      const check = new THREE.Group()
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.22), m.gold)
      a.position.set(-0.08, 0, 0.04)
      a.rotation.y = Math.PI / 4
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.42), m.gold)
      b.position.set(0.08, 0, -0.02)
      b.rotation.y = -Math.PI / 4
      check.add(a, b)
      check.position.set(0.05, 0.23, -0.04)
      o.add(check)
      o.userData.check = check
    }),
    // 4 Proceed with application: the lender (a bank) and its decision seal
    station(STOPS[3], (o) => {
      const base = slab(0.86, 0.08, 0.6, m.white, 0.015)
      o.add(base)
      ;[-0.3, -0.1, 0.1, 0.3].forEach((x) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.46, 16), m.white)
        col.position.set(x, 0.31, 0.12)
        o.add(col)
      })
      const wall = slab(0.76, 0.46, 0.3, m.stone, 0.01)
      wall.position.set(0, 0.08, -0.1)
      o.add(wall)
      const beam = slab(0.9, 0.07, 0.62, m.navy, 0.012)
      beam.position.y = 0.54
      // Pediment: a triangular gable extruded front to back
      const tri = new THREE.Shape()
      tri.moveTo(-0.47, 0)
      tri.lineTo(0.47, 0)
      tri.lineTo(0, 0.26)
      tri.closePath()
      const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.6, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2 }), m.navy)
      roof.position.set(0, 0.61, -0.3)
      o.add(beam, roof)
      // Neutral decision seal: gold ring around a navy disc (no tick, no promise)
      const seal = new THREE.Group()
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.04, 40), m.navy)
      disc.rotation.x = Math.PI / 2
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.025, 10, 48), m.gold)
      seal.add(disc, ring)
      seal.position.set(0.62, 0.95, 0.1)
      o.add(seal)
      o.userData.seal = seal
    }),
  ]

  // The application card that travels the path
  const token = new THREE.Group()
  const card = slab(0.5, 0.04, 0.34, m.white, 0.01)
  const header = slab(0.5, 0.012, 0.09, m.navy, 0.004)
  header.position.set(0, 0.04, -0.125)
  const lines = [0, 1].map((i) => {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.3 - i * 0.08, 0.008, 0.025), m.gold)
    l.position.set(-0.06 + i * 0.04 * 0, 0.045, 0.0 + i * 0.07)
    return l
  })
  token.add(card, header, ...lines)
  token.scale.setScalar(1.35)
  root.add(token)

  const shadow = contactShadow(4.6, 0.16)
  shadow.scale.set(0.42, 1, 1)
  shadow.position.y = -0.01
  root.add(shadow)

  // High three-quarter view looking down the path; pull back on narrow panels
  const TARGET = new THREE.Vector3(0, 0.35, 0.55)
  const DIR = new THREE.Vector3(0, 8.3, 7.4).normalize()
  const resize = (w, h) => {
    const dist = 15.6 * Math.max(1, 0.78 / (w / h))
    stage.camera.position.copy(TARGET).addScaledVector(DIR, dist)
    stage.camera.lookAt(TARGET)
  }

  // Progress arrives piecewise (1/(n-1) per step), so map it the same way
  // onto the stations: the card reaches station i exactly as step i lights up
  const stationAt = (p) => {
    const f = clamp01(p) * (STOPS.length - 1)
    const i = Math.min(Math.floor(f), STOPS.length - 2)
    return STOPS[i] + (STOPS[i + 1] - STOPS[i]) * (f - i)
  }

  let u = STOPS[0]
  const tangent = new THREE.Vector3()
  return {
    resize,
    frame(t, dt) {
      const target = stationAt(stage.scrollProgress())
      u = stage.still ? target : damp(u, target, 5, dt || 1)
      const pos = curve.getPointAt(u)
      curve.getTangentAt(u, tangent)
      token.position.set(pos.x, 0.55 + Math.sin(t * 2) * 0.03, pos.z + 0.2)
      // Lies like a document, tipped toward the viewer, turning a little with the path
      token.rotation.set(0.45, Math.atan2(tangent.x, tangent.z) * 0.5, 0)

      // The station nearest the card lifts slightly
      stations.forEach((s, i) => {
        const near = 1 - Math.min(1, Math.abs(u - STOPS[i]) / 0.12)
        const lift = easeOutCubic(near)
        s.obj.position.y = damp(s.obj.position.y, 0.08 + lift * 0.12, 6, dt || 1)
        s.obj.scale.setScalar(damp(s.obj.scale.x, 1.3 + lift * 0.1, 6, dt || 1))
        s.obj.rotation.y = Math.sin(t * 0.5 + i) * 0.08
      })
      const check = stations[2].obj.userData.check
      check.scale.setScalar(Math.max(0.001, easeOutCubic((u - STOPS[2] + 0.05) / 0.08)))
      const seal = stations[3].obj.userData.seal
      seal.rotation.y = t * 0.6
      seal.position.y = 0.95 + Math.sin(t * 1.2) * 0.04

      root.rotation.y = stage.tilt.y * 0.1
      root.rotation.x = stage.tilt.x * 0.03
    },
  }
}

export function mount(canvas, { still, getProgress } = {}) {
  return createStage(canvas, scene, { fov: 28, camera: [0, 11, 10], target: [0, 0.35, 0.1], still, getProgress })
}
