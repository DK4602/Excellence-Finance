import Scene3D from './Scene3D'

const loadMark = () => import('../three/brandMark.js')

// Shown while the 3D scene loads, and wherever 3D is not used
function StillMark() {
  return (
    <div className="grid size-full place-items-center">
      <img
        src="/brand/logo-mark.png"
        alt=""
        width={160}
        height={248}
        className="h-[58%] w-auto object-contain drop-shadow-[0_24px_30px_rgb(19_35_92/0.22)]"
      />
    </div>
  )
}

export default function HeroMark3D() {
  return (
    <div className="relative aspect-square w-full" aria-hidden="true">
      {/* Soft stage: a pale halo from the brand palette */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,var(--color-sky),transparent)]" />
      <Scene3D load={loadMark} fallback={<StillMark />} className="size-full" />
    </div>
  )
}
