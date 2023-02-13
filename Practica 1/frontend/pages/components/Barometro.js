import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const width = 250
const height = 250

let cx, cy, barometerRadius
let clockDiameter
let pressure_ = 225

export default function Barometro({ pressure }) {
  pressure_ = pressure * 0.75
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
    p5.fill(22, 163, 74)
    p5.ellipse(cx, cy, clockDiameter + 25, clockDiameter + 25)
    p5.fill(34, 197, 94)
    p5.ellipse(cx, cy, clockDiameter, clockDiameter)

    let s = p5.map(pressure, 0, 1200, 0, p5.TWO_PI - 1) + p5.HALF_PI + 0.5

    p5.stroke(255)
    p5.strokeWeight(2)
    p5.line(
      cx,
      cy,
      cx + p5.cos(s) * barometerRadius,
      cy + p5.sin(s) * barometerRadius
    )
    p5.textSize(15)
    // Draw the minute ticks
    p5.noStroke()
    p5.fill(255)
    for (let a = 0; a < 340; a += 40) {
      let angle = p5.radians(a) + p5.HALF_PI + 0.5
      let x = cx + p5.cos(angle) * barometerRadius
      let y = cy + p5.sin(angle) * barometerRadius

      switch (a) {
        case 0:
          p5.text('225', x - 10, y)
          break
        case 40:
          p5.text('300', x - 10, y)
          break
        case 80:
          p5.text('375', x - 10, y)
          break
        case 120:
          p5.text('450', x - 10, y)
          break
        case 160:
          p5.text('525', x - 10, y)
          break
        case 200:
          p5.text('600', x - 10, y)
          break
        case 240:
          p5.text('675', x - 10, y)
          break
        case 280:
          p5.text('750', x - 10, y)
          break
        case 320:
          p5.text('825', x - 10, y)
          break
      }
      //p5.text(a, x - 10, y)
    }
    p5.fill('#1e293b')
    p5.rect(70, 50, 110, 30, 20)
    p5.textSize(12)
    p5.fill('#fff')
    p5.text(pressure_ + ' mmHg', 85, 70)
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white bg-cyan-800 text-center mb-2 rounded mx-10">
        Barometro
      </div>
      <div className="mx-[3px]">
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  )
}
