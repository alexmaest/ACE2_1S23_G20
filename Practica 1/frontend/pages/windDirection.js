import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getWindDirection } from './services/useReports'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const width = 720
const height = 400

const windDirection = () => {
  const [windDirections, setWindDirections] = useState([])

  useEffect(() => {
    getWindDirection().then((data) => {
      setWindDirections(data)
    })
  }, [])

  var north = windDirections.filter((item) => item == 'N').length
  var east = windDirections.filter((item) => item == 'E').length
  var south = windDirections.filter((item) => item == 'S').length
  var west = windDirections.filter((item) => item == 'W').length

  var total = north + east + south + west

  let angles = [
    (north / total) * 100,
    (east / total) * 100,
    (south / total) * 100,
    (west / total) * 100,
  ]

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.noStroke()
  }

  const draw = (p5) => {
    // p5.background('#0f172a')
    let lastAngle = 0

    for (let i = 0; i < angles.length; i++) {
      var slice_color
      if (i == 0) {
        slice_color = '#ffbe0b'
      } else if (i == 1) {
        slice_color = '#fb5607'
      } else if (i == 2) {
        slice_color = '#ff006e'
      } else {
        slice_color = '#3a86ff'
      }
      p5.fill(slice_color)
      p5.arc(
        width / 2,
        height / 2,
        300,
        300,
        lastAngle,
        lastAngle + p5.radians(angles[i] * 3.6)
      )
      lastAngle += p5.radians(angles[i] * 3.6)
    }
    p5.textSize(32)
    p5.fill('#fff')
    p5.text('N', 45, 32)
    p5.text('E', 45, 64)
    p5.text('S', 45, 96)
    p5.text('O', 45, 128)
    p5.fill('#ffbe0b')
    p5.rect(20, 11, 20)
    p5.fill('#fb5607')
    p5.rect(20, 42, 20)
    p5.fill('#ff006e')
    p5.rect(20, 74, 20)
    p5.fill('#3a86ff')
    p5.rect(20, 106, 20)
  }

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Velocidad del viento
        </h1>
      </div>
      <div className="w-full h-full content-center">
        <div className="flex justify-center content-center mx-[3px]">
          <Sketch setup={setup} draw={draw} />
        </div>
      </div>
    </>
  )
}

export default windDirection
