import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Datepicker from 'react-tailwindcss-datepicker'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

let t = 0

const width = 250
const height = 250
const x = width / 2
const y = height / 2

export default function Viento({ velocidad }) {
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  })
  const [date, setDate] = useState({
    fechaInicio: new Date().toLocaleDateString('en-GB'),
    fechaFin: new Date().toLocaleDateString('en-GB'),
  })

  const handleValueChange = (newValue) => {
    setValue(newValue)
    setDate({
      fechaInicio:
        newValue.startDate instanceof Date
          ? newValue.startDate.toLocaleDateString('en-GB')
          : new Date(newValue.startDate).toLocaleDateString('en-GB'),
      fechaFin: new Date(newValue.endDate).toLocaleDateString('en-GB'),
    })
  }

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

    // 0.010 - lento
    // 0.015 - medio
    // 0.020 - rapido
    let velocidadAux =
      velocidad > 0 && velocidad < 100
        ? Number(`0.01${velocidad}`)
        : velocidad == 0
        ? 0.0
        : 0.02

    t = t + velocidadAux // Velocidad de la animación
    //p5.fill('#1e293b')
    //p5.rect(x - 80, y - 18, 150, 30, 20)
    p5.textSize(20)
    p5.fill('#fff')
    p5.text(velocidad + ' km/h', 80, 130)
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white text-center mb-4 ring-2 ring-indigo-600 mx-10 rounded">
        Velocidad del viento
      </div>
      <div className="mx-[3px]">
        <Link
          href={{
            pathname: '/velocidadViento',
            query: {
              fechaInicio: date.fechaInicio,
              fechaFin: date.fechaFin,
            },
          }}
          as={`/velocidadViento/${date.fechaInicio}-${date.fechaFin}`}
        >
          <Sketch setup={setup} draw={draw} />
        </Link>
        <Datepicker
          primaryColor="indigo"
          value={value}
          onChange={handleValueChange}
        />
      </div>
    </div>
  )
}
