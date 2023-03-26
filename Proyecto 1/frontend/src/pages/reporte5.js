import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Constants } from '@/constants'
import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'

// gráfico de barras creación propia
let myBarChart

export default function Reporte5() {
  // datos default
  let tituloBarra0 = ''
  let ejeYName0 = ''
  let ejeXName0 = ''
  let listaDatos0 = ''
  // para que pueda usar el canvas en react
  const canvasRef = useRef(null)

  const router = useRouter()
  const { date, time } = router.query

  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`http://${Constants.IP_ADDRESS}:3555/api/reporte5`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date,
        time
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.reportData)
      })
  }, [date, time])

  // este se encarga de dibujar el gráfico de barras----------------------
  useEffect(() => {
    // obtengo el canvas y ctx
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // dimensiones en base a la ventana
    canvas.width = window.innerWidth * 0.95
    canvas.height = window.innerHeight * 0.85

    // Dibujar un rectángulo en el canvas >>>> color de fondo
    ctx.fillStyle = '#C1BFE1'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // esto dibujare cambio las variables anteriores
    tituloBarra0 = 'porcentaje de cumplimiento de los 4 pomodoros'
    ejeYName0 = 'porcentaje(%)'
    ejeXName0 = 'ciclos pomodoro'

    // lo primordial
    // listaDatos0 = 'pararse,10-sentarse,2'
    data.forEach((item, index) => {
      listaDatos0 += `${item.idPomodoro} %C1,${Math.round(item.porcentajeCumplimiento1)}-${item.idPomodoro} %IC1,${Math.round(item.porcentajeIncumplimiento1)}-${item.idPomodoro} %PP1,${Math.round(item.porcentajePenalizacionParado1)}-${item.idPomodoro} %PS1,${Math.round(item.porcentajePenalizacionSentado1)}-${item.idPomodoro} %C2,${Math.round(item.porcentajeCumplimiento2)}-${item.idPomodoro} %IC2,${Math.round(item.porcentajeIncumplimiento2)}-${item.idPomodoro} %PP2,${Math.round(item.porcentajePenalizacionParado2)}-${item.idPomodoro} %PS2,${Math.round(item.porcentajePenalizacionSentado2)}-${item.idPomodoro} %C3,${Math.round(item.porcentajeCumplimiento3)}-${item.idPomodoro} %IC3,${Math.round(item.porcentajeIncumplimiento3)}-${item.idPomodoro} %PP3,${Math.round(item.porcentajePenalizacionParado3)}-${item.idPomodoro} %PS3,${Math.round(item.porcentajePenalizacionSentado3)}-${item.idPomodoro} %C4,${Math.round(item.porcentajeCumplimiento4)}-${item.idPomodoro} %IC4,${Math.round(item.porcentajeIncumplimiento4)}-${item.idPomodoro} %PP4,${Math.round(item.porcentajePenalizacionParado4)}-${item.idPomodoro} %PS4,${Math.round(item.porcentajePenalizacionSentado4)}`
      if (index !== data.length - 1) {
        listaDatos0 += '-'
      }
    })

    // OBJ inicial si o si debe de estar
    myBarChart = new BarChart({
      canvas,
      seriesName: 'Vinyl records',
      seriesNameY: 'eje y',
      seriesNameX: 'eje x',
      padding: 35,
      gridStep: 5,
      gridColor: 'black',
      data: {
        'Classical Music': 16,
        'Alternative Rock': 12,
        Pop: 18,
        Jazz: 32
      },

      // en colors puede ir bien una lista larga por default
      colors: ['#00B0FF', '#002AFF', '#7B00B9', '#AE00FF', '#FF8787', '#FF0000', '#CB0000', '#8B0000', '#6DFF88', '#00FF2F', '#75F100', '#58B500', '#FEFF67', '#FDFF00', '#E2C500', '#B39C00'],
      titleOptions: {
        align: 'center',
        fill: 'black',
        font: {
          weight: 'bold',
          size: '18px',
          family: 'Lato'
        }
      }
    })

    // gráfico de inicio(por default)
    // myBarChart.draw() // se manda a dibujar todo el objeto(gráfico de barras)

    // lo que importa de verdad
    draw(myBarChart, tituloBarra0, ejeYName0, ejeXName0, listaDatos0)
  }, [data, draw, tituloBarra0, ejeYName0, ejeXName0, listaDatos0])

  // dibujar linea en canvas
  function drawLine(ctx, startX, startY, endX, endY, color) {
    ctx.save()
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.restore()
  }

  // dibujar barra en canvas
  function drawBar(
    ctx,
    upperLeftCornerX,
    upperLeftCornerY,
    width,
    height,
    color, value, puntoX, valorBarra
  ) {
    ctx.save()
    ctx.fillStyle = color
    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height)
    ctx.restore()

    // ctx.fillStyle = color;
    // ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
    ctx.restore()

    // --------new nombre en eje x
    ctx.save()
    ctx.translate(upperLeftCornerX + 9, puntoX - 5)
    ctx.rotate(-0.5 * Math.PI)

    ctx.fillStyle = '#181818'
    ctx.font = '12px serif' // "bold 12px serif"
    ctx.fillText(value+": "+valorBarra+"", 0, 0)

    ctx.restore()

    /*

    // ---------new name de barra inclinado
    // nombre de barra
    ctx.save()
    ctx.translate(upperLeftCornerX + 5, upperLeftCornerY)
    ctx.rotate(-(Math.PI / 4))
    ctx.fillStyle = '#BA8C21'
    ctx.textAlign = 'left'
    ctx.font = '12px serif' // "bold 12px serif"
    ctx.fillText(valorBarra, 2, 0)
    ctx.restore()*/
  }

  // objeto canvas para el gráfico de barras
  class BarChart {
    constructor(options) { // constructor del BarChart
      this.options = options
      this.canvas = options.canvas
      this.ctx = this.canvas.getContext('2d')
      this.colors = options.colors
      this.titleOptions = options.titleOptions
      this.maxValue = Math.max(...Object.values(this.options.data))

      // creamos la lista que identifica a c/u de las barras del gráfico

      /*
      this.ul = document.createElement('ul')
      this.ul2 = document.createElement('ul')
      this.ul3 = document.createElement('ul')
  
      this.ul4 = document.createElement('ul')
      this.ul5 = document.createElement('ul')
      this.ul6 = document.createElement('ul')
  
      this.ul7 = document.createElement('ul')
      this.ul8 = document.createElement('ul')
      this.ul9 = document.createElement('ul') */

      // this.ul.className="social-icons"

      // identificador de esta lista de c/u de las barras en el gráfico

      /*
      this.ul.id = 'legends'
      this.ul2.id = 'legends2'
      this.ul3.id = 'legends3'
  
      this.ul4.id = 'legends4'
      this.ul5.id = 'legends5'
      this.ul6.id = 'legends6'
  
      this.ul7.id = 'legends7'
      this.ul8.id = 'legends8'
      this.ul9.id = 'legends9'
      */
    }

    // inician los métodos de esta clase (métodos gráficos)
    // 1
    drawGridLines() { // dibuja las lineas horizontales para identificar o darle un fondo mas legible respecto a los valores en el eje y
      const canvasActualHeight = this.canvas.height - this.options.padding * 2
      const canvasActualWidth = this.canvas.width - this.options.padding * 2
      let gridValue = 0
      while (gridValue <= this.maxValue) {
        const gridY =
          canvasActualHeight * (1 - gridValue / this.maxValue) +
          this.options.padding
        drawLine(// barra horizontal del eje x
          this.ctx,
          17,
          gridY,
          this.canvas.width,
          gridY,
          this.options.gridColor
        )
        drawLine(// barra vertical del eje y
          this.ctx,
          24,
          this.options.padding / 2,
          24,
          gridY + this.options.padding / 2,
          this.options.gridColor
        )
        // Writing grid markers son los números por linea
        this.ctx.save()
        this.ctx.fillStyle = 'red'
        this.ctx.textBaseline = 'bottom'
        this.ctx.font = 'bold 10px Arial'
        this.ctx.fillText(Math.round(gridValue), 0, gridY - 4)
        this.ctx.restore()
        gridValue += this.options.gridStep
      }
    }

    // 2
    drawBars() { // dibuja todas las barras del canvas se auto-ajusta
      const canvasActualHeight = this.canvas.height - this.options.padding * 2
      const canvasActualWidth = this.canvas.width - this.options.padding * 2
      let barIndex = 0
      const numberOfBars = Object.keys(this.options.data).length
      const barSize = canvasActualWidth / numberOfBars
      const values = Object.values(this.options.data)

      const array = Object.keys(this.options.data)
      let contador = 0
      for (const val of values) {
        const barHeight = Math.round((canvasActualHeight * val) / this.maxValue)
        drawBar(
          this.ctx,
          this.options.padding + barIndex * barSize,
          this.canvas.height - barHeight - this.options.padding,
          barSize,
          barHeight,
          this.colors[barIndex % this.colors.length], array[contador], // new  le envío valor a mostrar en la barra
          this.canvas.height - 15, val
        )

        // barra roja final de pomodoro========================================
        if (array[contador].includes('Ciclo:1')) {
          drawLine(
            this.ctx,
            this.options.padding + barIndex * barSize,
            this.options.padding,
            this.options.padding + barIndex * barSize,
            this.ctx.canvas.clientHeight - 25,
            '#00FBFF'
          )
        }

        barIndex++
        contador++
      }
    }

    // 3
    drawLabel() { // dibuja el titulo del gráfico
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family} `
      let xPos = this.canvas.width / 2
      if (this.titleOptions.align == 'left') {
        xPos = 10
      }
      if (this.titleOptions.align == 'right') {
        xPos = this.canvas.width - 10
      }
      this.ctx.fillText(this.options.seriesName, xPos + 45, 18)
      this.ctx.restore()
    }

    drawLabelY() { // dibuja el titulo del eje y
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family} `
      let xPos = this.canvas.width / 2
      if (this.titleOptions.align == 'left') {
        xPos = 10
      }
      if (this.titleOptions.align == 'right') {
        xPos = this.canvas.width - 10
      }
      this.ctx.fillText(this.options.seriesNameY, 55, 18)
      this.ctx.restore()
    }

    drawLabelX() { // dibuja el titulo del eje x
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family} `
      let xPos = this.canvas.width / 2
      if (this.titleOptions.align == 'left') {
        xPos = 10
      }
      if (this.titleOptions.align == 'right') {
        xPos = this.canvas.width - 10
      }
      this.ctx.fillText(this.options.seriesNameX, this.canvas.width - 65, this.canvas.height - 1)
      this.ctx.restore()
    }

    drawLabel2() { // dibuja el #muestras del gráfico
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family} `
      let xPos = this.canvas.width / 2
      if (this.titleOptions.align == 'left') {
        xPos = 10
      }
      if (this.titleOptions.align == 'right') {
        xPos = this.canvas.width - 10
      }

      // numero de elementos del gráfico
      const values = Object.values(this.options.data)

      this.ctx.fillText('Muestra:' + values.length+"|Cumplimiento,Incumplimiento,Penalizacion Parado,Penalizacion Sentado", xPos, this.canvas.height)
      this.ctx.restore()
    }

    // el método que importa xd (manda a llamar a todos los anteriores)
    draw() { // manda a dibujar todo en el canvas gráfico-barras
      this.drawGridLines()// dibuja el lineado del gráfico
      this.drawBars()// las barras
      this.drawLabel()// el titulo del gráfico
      this.drawLabel2()// el num de muestra
      this.drawLabelY()// nombre eje y
      this.drawLabelX()// nombre eje x
      // this.drawLegend()// nombre de cada barra de color
    }
  }

  //* ************************************************************************************************************* */
  //* ************************************************************************************************************* */

  // borra todo(limpia la pantalla)
  function reset() {
    // borro el gráfico de barras
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function draw(myBarChart, tituloBarra, ejeYName, ejeXName, listaDatos) {
    // los params se los paso a las var globales para cuando se llame a la función window.resize sea la misma a la ingresada
    tituloBarra0 = tituloBarra
    ejeYName0 = ejeYName
    ejeXName0 = ejeXName
    listaDatos0 = listaDatos

    // options es el atributo que nos importa con este modificamos lo que le enviamos
    // en el constructor del BarChart
    myBarChart.options.seriesName = tituloBarra
    myBarChart.options.seriesNameY = ejeYName
    myBarChart.options.seriesNameX = ejeXName

    // borro el gráfico anterior para graficar el nuevo
    reset()

    const values = listaDatos.split('-')// carácter de separación

    // creo el array
    const countries = []

    for (let i = 0; i < values.length; i++) {
      const values2 = values[i].split(',')
      // armo el objeto y lo meto al array
      countries.push({ medida: values2[0], valor: values2[1] })
    }

    // convierto el array a OBJ
    const final = convertArrayToObject(countries, 'medida')// paso de array a objeto

    // se lo asigno a myBarChart options.data
    myBarChart.options.data = final

    // calculo de nuevo el max valor del data
    myBarChart.maxValue = Math.max(...Object.values(myBarChart.options.data))

    // defino el valor por linea hasta el max
    //myBarChart.options.gridStep = myBarChart.maxValue / values.length

    //* ********************* defino un valor max para que asi se mire mejor la gráfica
    myBarChart.maxValue = 20 + Math.max(...Object.values(myBarChart.options.data))

    // ----------------------------------------------------------------
    // se manda a dibujar todo el objeto(gráfico de barras)
    myBarChart.draw()
  }

  const convertArrayToObject = (array, key) => {
    const initialValue = {}
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: Number(item.valor)
      }
    }, initialValue)
  }

  return (
    <>
      <Head>
        <title>Penalizaciones</title>
      </Head>
      <Navbar />

      <section className="flex">
        <div className="flex-1 p15">
          <canvas ref={canvasRef} width={1500} height={1500} >
          </canvas>
          <legend htmlFor="myCanvas"></legend>
        </div>
      </section>
    </>
  )
}
