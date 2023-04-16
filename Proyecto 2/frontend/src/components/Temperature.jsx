import Sketch from "react-p5";

const sizeWidth = 250
const sizeHeight = 250
const x = sizeWidth / 2
const y = sizeHeight / 1.3

export default function Temperature({ temp }) {
  let cBack, cFront
  let movTemp = 0
  let temperature = 0

  temperature = temp
  temp <= 10 ? (temperature *= 8) : (temperature *= 4)

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(sizeWidth, sizeHeight).parent(canvasParentRef)
  }

  const draw = (p5) => {
    // Crear un termómetro
    p5.noStroke()
    // Se crea un objeto de tipo color
    if (temperature >= 100) {
      cFront = p5.color(239, 68, 68)
    } else {
      cFront = p5.color('#06b6d4')
    }
    cBack = p5.color(51)
    // Se asigna el color al objeto
    p5.fill(cBack)
    // Se dibuja un rectángulo de la base del termómetro
    p5.rect(x - 10, y - 180, 20, 200)
    p5.fill(cFront)
    p5.rect(x - 5, y - movTemp - 5, 10, movTemp)
    // Se asigna el color al objeto
    p5.fill(cBack)
    // Se dibuja un círculo de la base del termómetro
    p5.ellipse(x, y, 70, 70)
    p5.fill(cFront)
    p5.ellipse(x, y, 55, 55)
    //Colocar texto de temperatura
    p5.fill('#fff')
    p5.textSize(15)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.text(temp + '°C', x, y)

    if (movTemp < temperature) {
      movTemp += 1
    } else {
      movTemp = temperature
    }
  }

  return <Sketch setup={setup} draw={draw} />
}
