import dynamic from 'next/dynamic'
import { GPoint, GPlot } from '@/grafica/grafica'
import Calendar from './Calendar'

// importamos react-p5 en client-side
// por defecto NextJs usa SSR (Server Side Rendering)

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const sizeWidth = 400
const sizeHeight = 400

export default function SimpleGraphic({ title, xLabel, yLabel, dias, grados }) {
  console.log(dias)
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(sizeWidth, sizeHeight).parent(canvasParentRef)
    let points = []
    for (let i = 0; i < dias; i++) {
      points[i] = new GPoint(i, grados[i])
    }
    let plot = new GPlot(p5)
    plot.setPos(0, 0)
    plot.setOuterDim(sizeWidth, sizeHeight)

    // Add the points
    plot.setPoints(points)

    // Set the plot title and the axis labels
    plot.setTitleText(title)
    plot.getXAxis().setAxisLabelText(xLabel)
    plot.getYAxis().setAxisLabelText(yLabel)

    // Draw it!
    plot.defaultDraw()
  }

  const draw = (p5) => {
    // Crear un termometro
  }

  return (
    <>
      <div className="w-full flex-row content-center p-2">
        <div className="mx-[3px]">
          <Sketch setup={setup} draw={draw} />
          <Calendar />
        </div>
      </div>
    </>
  )
}
