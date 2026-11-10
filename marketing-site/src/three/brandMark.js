// Hero: real-time 3D version of the Excellence Finance mark, a two-tone
// arrow (navy / cyan) holding four rising bars on a gold chevron.
import * as THREE from 'three'
import { createStage, materials, contactShadow, easeOutCubic, easeOutBack, easeInOutCubic } from './runtime'

const EXTRUDE = { depth: 0.42, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 5, curveSegments: 8 }

function extrude(points, material) {
  const s = new THREE.Shape()
  points.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)))
  s.closePath()
  const g = new THREE.ExtrudeGeometry(s, EXTRUDE)
  g.translate(0, 0, -EXTRUDE.depth / 2)
  return new THREE.Mesh(g, material)
}

function scene(stage) {
  const m = materials()
  const root = new THREE.Group()
  stage.scene.add(root)

  const mark = new THREE.Group()
  root.add(mark)

  const left = [[-0.78, -1.42], [0, -1.06], [0, 1.62], [-1.3, 0.3], [-0.78, 0.3]]
  const right = left.map(([x, y]) => [-x, y]).reverse()
  const arrow = new THREE.Group()
  arrow.add(extrude(left, m.navy), extrude(right, m.cyan))
  mark.add(arrow)

  const chevron = extrude([[-1.02, -1.6], [0, -1.22], [1.02, -1.6], [1.02, -1.9], [0, -1.52], [-1.02, -1.9]], m.gold)
  mark.add(chevron)

  const bars = [0.5, 0.82, 1.14, 1.5].map((h, i) => {
    const geo = new THREE.BoxGeometry(0.24, h, 0.16)
    geo.translate(0, h / 2, 0)
    const bar = new THREE.Mesh(geo, m.white)
    bar.position.set(-0.51 + i * 0.34, -0.98 + i * 0.02, EXTRUDE.depth / 2 + 0.09)
    bar.scale.y = 0.001
    mark.add(bar)
    return bar
  })

  const shadow = contactShadow(1.5, 0.28)
  shadow.position.y = -2.35
  root.add(shadow)

  return {
    frame(t) {
      // Premium entrance: rise and turn in, chevron slides up, bars grow, light sweeps
      const enter = easeOutCubic(t / 1.5)
      mark.scale.setScalar(0.84 + 0.16 * easeOutBack(t / 1.5))
      chevron.position.y = -0.7 * (1 - easeOutCubic((t - 0.25) / 1.1))
      bars.forEach((b, i) => (b.scale.y = Math.max(0.001, easeOutBack((t - 0.65 - i * 0.14) / 0.7))))
      stage.key.position.x = -7 + 4 * easeInOutCubic(t / 2)

      // Layered float and slow sway, plus a gentle tilt toward the cursor
      const float = (Math.sin(t * 0.8) * 0.06 + Math.sin(t * 0.37) * 0.03) * enter
      mark.position.y = -0.45 * (1 - enter) + float
      mark.rotation.y = -0.85 * (1 - enter) + Math.sin(t * 0.32) * 0.28 * enter + stage.tilt.y * 0.4
      mark.rotation.x = stage.tilt.x * 0.22
      // Shadow tightens and darkens as the mark comes down
      const s = 1 - float * 1.4
      shadow.scale.set(s, s, s)
      shadow.material.opacity = (0.75 + float * -2) * enter
    },
  }
}

export function mount(canvas, { still } = {}) {
  return createStage(canvas, scene, { camera: [0, 0.05, 8.6], target: [0, -0.15, 0], still })
}
