import dynamic from 'next/dynamic'
import Link from 'next/link'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

export default function HumedadRelativa({ porcentage }) {
  let cBack, cFront
  let porcentage_ = porcentage
  console.log(porcentage_)

  const sizeWidth = 250
  const sizeHeight = 250

  const x = sizeWidth / 2
  const y = sizeHeight / 2

  let radiusBack = 200
  let radiusFront = 0

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(sizeWidth, sizeHeight).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.noStroke()
    p5.background('#0f172a')
    cBack = p5.color(250, 204, 21)
    cFront = p5.color(37, 99, 235)
    p5.fill(cBack)
    p5.ellipse(x, y, radiusBack, radiusBack)
    p5.fill(cFront)
    p5.ellipse(
      x,
      y + radiusBack / 2 - radiusFront / 2,
      radiusFront,
      radiusFront
    )
    p5.fill('#fff')
    p5.textSize(18)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.text(porcentage_, x, -radiusFront / 2 + y + radiusBack / 2)

    radiusFront <= porcentage_ * 2 ? (radiusFront += 1) : radiusFront
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white text-center mb-4 ring-2 ring-indigo-600 mx-10 rounded">
        Humedad Relativa
      </div>
      <Link href="/humedadRelativa">
        <div className="mx-[3px]">
          <Sketch setup={setup} draw={draw} />
        </div>
      </Link>
    </div>
  )
}
