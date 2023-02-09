import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const width = 250
const height = 250

let drops = []

export default function PuntoRocio({ numbersOfDrops }) {
  useEffect(() => {
    console.log(numbersOfDrops)
  }, [numbersOfDrops])

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.noStroke()
    p5.fill(255)
    for (let i = 0; i < numbersOfDrops; i++) {
      drops[i] = new Drop(p5)
    }
  }

  const draw = (p5) => {
    p5.background('#1e293b')
    for (let i = 0; i < drops.length; i++) {
      drops[i].show(p5)
      drops[i].fall(p5)
    }
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white bg-cyan-800 text-center mb-2 rounded mx-10">
        Punto de Rocío
      </div>
      <Link href="/temperatura">
        <div className="mx-[3px]">
          <Sketch setup={setup} draw={draw} />
        </div>
      </Link>
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
  fall(p5) {
    this.yspeed = p5.random(5, 10)
    this.gravity = 0.5
    this.y = this.y + this.yspeed * this.gravity

    if (this.y > height) {
      this.y = p5.random(0, -height)
    }
  }
}
