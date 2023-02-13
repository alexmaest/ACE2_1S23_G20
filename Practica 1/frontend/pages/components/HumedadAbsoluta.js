import dynamic from 'next/dynamic'

const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
  ssr: false,
})

const width = 250
const height = 250

const x = width / 2
const y = height / 2

let numParticles
let spring = 0.05
let gravity = 0.09
let friction = -0.9
let particles = []

export default function HumedadAbsoluta({ cant = 100 }) {
  numParticles = Math.floor(cant)
  if (numParticles > 100) {
    numParticles = 100
  }
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(width, height).parent(canvasParentRef)
    for (let i = 0; i < numParticles; i++) {
      particles[i] = new Particle(
        p5.random(width),
        p5.random(height),
        p5.random(10, 30),
        i,
        particles
      )
    }
  }

  const draw = (p5) => {
    //p5.stroke('#0c4a6e')
    p5.noStroke()
    p5.fill(255)
    p5.background('#1e293b')
    particles.forEach((particle) => {
      particle.collide()
      particle.move()
      particle.display(p5)
    })
    p5.fill('#1e293b')
    p5.rect(x - 80, y - 18, 150, 30, 20)
    p5.textSize(20)
    p5.fill('#fff')
    p5.text(cant + ' Gr/m3', 80, 130)
  }

  return (
    <div className="w-64 flex-row content-center">
      <div className="text-white bg-cyan-800 text-center mb-2 rounded mx-10">
        Humedad Absoluta
      </div>
      <div className="mx-[3px]">
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  )
}

class Particle {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin
    this.y = yin
    this.vx = 0
    this.vy = 0
    this.diameter = din
    this.id = idin
    this.others = oin
  }

  collide() {
    for (let i = this.id + 1; i < numParticles; i++) {
      let dx = this.others[i].x - this.x
      let dy = this.others[i].y - this.y
      let distance = Math.sqrt(dx * dx + dy * dy)
      let minDist = this.others[i].diameter / 2 + this.diameter / 2
      if (distance < minDist) {
        let angle = Math.atan2(dy, dx)
        let targetX = this.x + Math.cos(angle) * minDist
        let targetY = this.y + Math.sin(angle) * minDist
        let ax = (targetX - this.others[i].x) * spring
        let ay = (targetY - this.others[i].y) * spring
        this.vx -= ax
        this.vy -= ay
        this.others[i].vx += ax
        this.others[i].vy += ay
      }
    }
  }

  move() {
    this.vy += gravity
    this.x += this.vx
    this.y += this.vy
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2
      this.vx *= friction
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2
      this.vx *= friction
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2
      this.vy *= friction
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2
      this.vy *= friction
    }
  }

  display(p5) {
    p5.ellipse(this.x, this.y, this.diameter, this.diameter)
  }
}
