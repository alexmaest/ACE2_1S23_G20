import dynamic from 'next/dynamic'
import Link from 'next/link'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

let t = 0

const width = 250
const height = 250
const x = width / 2
const y = height / 2

export default function Viento() {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.noStroke()
  }

  const draw = (p5) => {
    p5.background('#1e293b')

    for (let x = 0; x < width; x = x + 30) {
      for (let y = 0; y < height; y = y + 30) {
        const anguloX = p5.map(50, 0, width, -2 * p5.PI, 2 * p5.PI, true)
        const anguloY = p5.map(100, 0, height, -2 * p5.PI, 2 * p5.PI, true)

        const angulo = anguloX * (x / width) + anguloY * (y / height)

        const myX = x + 20 * p5.cos(2 * p5.PI * t + angulo)
        const myY = y + 20 * p5.sin(2 * p5.PI * t + angulo)

        p5.ellipse(myX, myY, 2)
      }
    }
    t = t + 0.014
    //p5.fill('#1e293b')
    //p5.rect(x - 80, y - 18, 150, 30, 20)
    p5.textSize(20)
    p5.fill('#fff')
    p5.text(10 + ' km/h', 80, 130)
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white bg-cyan-800 text-center mb-2 rounded mx-10">
        Velocidad del viento
      </div>
      <Link href="/temperatura">
        <div className="mx-[3px]">
          <Sketch setup={setup} draw={draw} />
        </div>
      </Link>
    </div>
  )
}
