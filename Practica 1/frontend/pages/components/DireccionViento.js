import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const width = 250
const height = 250

let cx, cy, barometerRadius
let clockDiameter

export default function DireccionViento({ direction }) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.stroke(255)

    let radius = p5.min(width, height) / 2
    barometerRadius = radius * 0.8
    clockDiameter = radius * 1.7

    cx = width / 2
    cy = height / 2
  }

  const draw = (p5) => {
    p5.background('#0f172a')
    p5.noStroke()
    p5.fill(49, 46, 129)
    p5.ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25)
    p5.fill(67, 56, 202)
    p5.ellipse(cx, cy, clockDiameter, clockDiameter)

    let s = p5.map(direction, 0, 4, 0, p5.TWO_PI) + p5.HALF_PI

    p5.stroke(255)
    p5.strokeWeight(2)
    p5.line(
      cx,
      cy,
      cx + p5.cos(s) * barometerRadius,
      cy + p5.sin(s) * barometerRadius
    )
    p5.textSize(20)
    p5.text('N', 115, 20)
    p5.text('E', 230, 130)
    p5.text('S', 120, 240)
    p5.text('O', 10, 130)
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white bg-cyan-800 text-center mb-2 rounded mx-10">
        Dirección del Viento
      </div>
      <div className="mx-[3px]">
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  )
}
