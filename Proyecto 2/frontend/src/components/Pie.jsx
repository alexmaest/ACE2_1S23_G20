import Sketch from "react-p5"

const width = 250
const height = 250

export default function Pie({ percentage }) {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
  }

  const draw = (p5) => {
    let lastAngle = 0
    let complement = 100 - percentage

    p5.strokeWeight(6);
    p5.stroke(51);

    p5.fill("#0ea5e9")
    p5.arc(
      width / 2,
      height / 2,
      200,
      200,
      lastAngle,
      lastAngle + p5.radians(percentage * 3.6)
    )
    lastAngle += p5.radians(percentage * 3.6)

    p5.fill("#7dd3fc")
    p5.arc(
      width / 2,
      height / 2,
      200,
      200,
      lastAngle,
      lastAngle + p5.radians(complement * 3.6)
    )

    lastAngle += p5.radians(complement * 3.6)

    p5.fill("#fff")
    p5.textSize(15)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.text(percentage + '%', width / 2, height / 2)
  }

  return <Sketch setup={setup} draw={draw} />

}
