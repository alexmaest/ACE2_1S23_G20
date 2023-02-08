import dynamic from 'next/dynamic'

//importamos react-p5 en client-side
//por defecto NextJs usa SSR (Server Side Rendering)

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

let c
let x = 50
let y = 50

export default function Temperatura() {
  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(500, 500).parent(canvasParentRef)
  }

  const draw = (p5) => {
    p5.background(0)
    // Se crea un objeto de tipo color
    c = p5.color(255, 204, 0)
    // Se asigna el color al objeto
    p5.fill(c)
    // Se dibuja un circulo
    p5.ellipse(x, y, 70, 70)
    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
    x++

    if (x > p5.width) {
      x = 0
    }
  }

  return <Sketch setup={setup} draw={draw} />
}
