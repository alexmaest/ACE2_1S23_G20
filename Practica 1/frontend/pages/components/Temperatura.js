import dynamic from 'next/dynamic'
import Link from 'next/link'

// importamos react-p5 en client-side
// por defecto NextJs usa SSR (Server Side Rendering)

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

let cBack, cFront
let movTemp = 0
let temperature = 0

const sizeWidth = 250
const sizeHeight = 250

const x = sizeWidth / 2
const y = sizeHeight / 1.3

export default function Temperatura({ temp }) {
  temperature = temp
  temp <= 10 ? (temperature *= 8) : (temperature *= 4)
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(sizeWidth, sizeHeight).parent(canvasParentRef)
  }

  const draw = (p5) => {
    // Crear un termometro
    p5.noStroke()
    p5.background('#0f172a')
    // Se crea un objeto de tipo color
    if (temperature >= 100) {
      cFront = p5.color(239, 68, 68)
    } else {
      cFront = p5.color('#06b6d4')
    }
    cBack = p5.color(209, 213, 219)
    // Se asigna el color al objeto
    p5.fill(cBack)
    // Se dibuja un rectangulo de la base del termometro
    p5.rect(x - 10, y - 180, 20, 200)
    p5.fill(cFront)
    p5.rect(x - 5, y - movTemp - 5, 10, movTemp)
    // Se asigna el color al objeto
    p5.fill(cBack)
    // Se dibuja un círculo de la base del termometro
    p5.ellipse(x, y, 70, 70)
    p5.fill(cFront)
    p5.ellipse(x, y, 55, 55)
    //Colocar texto de temperatura
    p5.fill('#fff')
    p5.textSize(20)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.text(temp + '°C', x, y)
    movTemp >= temperature ? movTemp : (movTemp += 1)

    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white bg-cyan-800 text-center mb-2 rounded mx-10">
        Temperatura externa
      </div>
      <Link href="/temperatura">
        <div className="mx-[3px]">
          <Sketch setup={setup} draw={draw} />
        </div>
      </Link>
    </div>
  )
}
