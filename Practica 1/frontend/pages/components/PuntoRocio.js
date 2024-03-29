import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Datepicker from 'react-tailwindcss-datepicker'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const width = 250
const height = 250

let drops = []
let numbersOfDrops_ = 100
export default function PuntoRocio({ intensity }) {
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
    p5.fill(255)
    for (let i = 0; i < numbersOfDrops_; i++) {
      drops[i] = new Drop(p5)
    }
  }

  const draw = (p5) => {
    p5.background('#1e293b')
    for (let i = 0; i < drops.length; i++) {
      drops[i].show(p5)
      drops[i].fall(p5, intensity)
    }
    //p5.fill('#1e293b')
    //p5.rect(x - 80, y - 18, 150, 30, 20)
    p5.textSize(20)
    p5.fill('#fff')
    p5.text(intensity + ' °C', 95, 130)
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white text-center mb-4 ring-2 ring-indigo-600 mx-10 rounded">
        Punto de Rocío
      </div>
      <div className="mx-[3px]">
        <Link
          href={{
            pathname: '/puntoRocio',
            query: {
              fechaInicio: date.fechaInicio,
              fechaFin: date.fechaFin,
            },
          }}
          as={`/puntoRocio/${date.fechaInicio}-${date.fechaFin}`}
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

class Drop {
  constructor(p5) {
    this.x = p5.random(0, width)
    this.y = p5.random(0, -height)
  }
  show(p5) {
    p5.ellipse(this.x, this.y, p5.random(1, 5), p5.random(1, 5))
  }
  fall(p5, intensity) {
    this.yspeed = (p5.random(5, 10) * intensity) / 100
    this.gravity = 0.5
    this.y = this.y + this.yspeed * this.gravity

    if (this.y > height) {
      this.y = p5.random(0, -height)
    }
  }
}
