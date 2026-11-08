// Builds web logo assets from brand/logo-original.jpg:
//   public/brand/logo.png        full lockup, white turned to transparency, trimmed
//   public/brand/logo-mark.png   the arrow mark only, transparent
//   public/favicon.png, public/apple-touch-icon.png
// Run: node brand/process-logo.mjs
import sharp from 'sharp'

const src = 'brand/logo-original.jpg'

// White -> alpha (colour-to-alpha against pure white), so edges stay smooth
async function toTransparent(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255
    if (a < 0.04) {
      data[i + 3] = 0
      continue
    }
    data[i] = Math.round((r - 255 * (1 - a)) / a)
    data[i + 1] = Math.round((g - 255 * (1 - a)) / a)
    data[i + 2] = Math.round((b - 255 * (1 - a)) / a)
    data[i + 3] = Math.round(a * 255)
  }
  return sharp(data, { raw: info })
}

const meta = await sharp(src).metadata()

// Full lockup
const full = await (await toTransparent(src)).png().toBuffer()
await sharp(full).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile('public/brand/logo.png')

// Mark: the arrow sits in roughly the left quarter
const markBox = { left: 0, top: 0, width: Math.round(meta.width * 0.26), height: meta.height }
const markRaw = await sharp(src).extract(markBox).toBuffer()
const mark = await (await toTransparent(markRaw)).png().toBuffer()
const trimmedMark = await sharp(mark).trim({ threshold: 1 }).png().toBuffer()
await sharp(trimmedMark).png({ compressionLevel: 9 }).toFile('public/brand/logo-mark.png')

// Square icons on white with padding
const icon = async (size, out, pad) => {
  const inner = Math.round(size * (1 - pad * 2))
  const m = await sharp(trimmedMark).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: m, gravity: 'center' }])
    .png()
    .toFile(out)
}
await icon(64, 'public/favicon.png', 0.08)
await icon(180, 'public/apple-touch-icon.png', 0.14)

for (const f of ['public/brand/logo.png', 'public/brand/logo-mark.png']) {
  const m = await sharp(f).metadata()
  console.log(f, m.width, 'x', m.height)
}

// Sample brand colours from the original
const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true })
const px = (x, y) => {
  const i = (Math.round(y) * info.width + Math.round(x)) * info.channels
  return '#' + [data[i], data[i + 1], data[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('')
}
console.log('samples', {
  navyText: px(meta.width * 0.42, meta.height * 0.36),
  grayText: px(meta.width * 0.37, meta.height * 0.7),
  gold: px(meta.width * 0.6, meta.height * 0.515),
  markLeft: px(meta.width * 0.07, meta.height * 0.45),
  markRight: px(meta.width * 0.17, meta.height * 0.3),
  chevron: px(meta.width * 0.12, meta.height * 0.88),
})
