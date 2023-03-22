import Head from 'next/head'
import Navbar from '../components/Navbar'
import { Constants } from '@/constants'
import { useRouter } from 'next/router'
import { useRef, useEffect, useState } from 'react'
import moment from 'moment'
// grafico de barras creacion propia
let myBarchart

export default function Reporte3 () {
  // datos default
  let tituloBarra0 = ''
  let ejeYname0 = ''
  let ejeXname0 = ''
  let listaDatos0 = ''
  const router = useRouter()
  const { date, time } = router.query

  const [data, setData] = useState([])
  // para que pueda usar el canvas en react
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch(`http://${Constants.IP_ADDRESS}:3555/api/getReporte3`, {
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
        setData(data._queryReport3)
      })
  }, [date, time])

  console.log({ data })
  // este se encarga de dibujar el grafico de barras----------------------
  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        const fechaFormateada = moment(data[i].fechaInicio).format('DD/MM/YYYY HH:mm:ss')
        const horaInicioPomodoro = moment(data[i].fechaInicio, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')
        const fechaSeLevanto = moment(data[i].fechaDato).format('DD/MM/YYYY HH:mm:ss')
        const horaSeLevanto = moment(data[i].fechaDato, 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')
        const diff = moment(horaSeLevanto, 'HH:mm:ss').diff(moment(horaInicioPomodoro, 'HH:mm:ss'))
        const seconds = moment.duration(diff).asSeconds()

        console.log({ secondsIIgualCero: seconds })

        if (data.length === 1) {
          listaDatos0 += `${fechaFormateada} ${seconds}s,1`
          listaDatos0 += `${fechaSeLevanto} ${data[i].tiempoParadoEnTrabajo}s,0`
        } else {
          listaDatos0 += `${fechaFormateada} ${seconds}s,1-`
          listaDatos0 += `${fechaSeLevanto} ${data[i].tiempoParadoEnTrabajo}s,0-`
        }
      } else {
        const horaSeLevanto = moment(data[i].fechaDato).format('HH:mm:ss')
        const horaAnteriorSeLevanto = moment(data[i - 1].fechaDato).format('HH:mm:ss')
        const segundosParado = moment.duration(data[i - 1].tiempoParadoEnTrabajo, 'seconds').asSeconds()

        // sumar los segundos segundosParado con la horaAnteriorSeLevando que es una fecha

        const add = moment(moment(data[i - 1].fechaDato).format('HH:mm:ss'), 'HH:mm:ss').add(segundosParado, 'seconds').format('HH:mm:ss')
        const fechaSeSento = moment(data[i - 1].fechaDato).add(segundosParado, 'seconds').format('DD/MM/YYYY HH:mm:ss')
        const fechaSeLevanto = moment(data[i].fechaDato).format('DD/MM/YYYY HH:mm:ss')
        console.log({ horaAnteriorSeLevanto })
        console.log({ add })
        console.log({ fechaSeSento })

        const diff = moment(horaSeLevanto, 'HH:mm:ss').diff(moment(add, 'HH:mm:ss'))
        const seconds = moment.duration(diff).asSeconds()
        console.log({ seconds })
        if (i === data.length - 1) {
          listaDatos0 += `${fechaSeSento} ${seconds}s,1-`
          listaDatos0 += `${fechaSeLevanto} ${data[i].tiempoParadoEnTrabajo}s,0`
        } else {
          listaDatos0 += `${fechaSeSento} ${seconds}s,1-`
          listaDatos0 += `${fechaSeLevanto} ${data[i].tiempoParadoEnTrabajo}s,0-`
        }
      }
    }

    console.log('listaDatos0', listaDatos0)

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
    tituloBarra0 = 'Sentado = 1'
    ejeYname0 = 'S/N'
    ejeXname0 = 't(s)'
    // listaDatos0 = 'A0,0-A1,1-A2,1-A3,0-A4,1'
    // lo primordial
    // listaDatos0 = 'pararse,10-sentarse,2'

    // listaDatos0="rojo,10-azul,20-verde,30-rosa,80-aqua,200-rojo1,10-azul1,20-verde1,30-rosa1,80-aqua1,200-rojo2,10-azul2,20-verde2,30-rosa2,80-aqua2,200-rojo3,10-azul3,20-verde3,30-rosa3,80-aqua3,200-rojo4,10-azul4,20-verde4,30-rosa4,80-aqua4,200-rojo5,10-azul5,20-verde5,30-rosa5,80-aqua5,200-rojo6,10-azul6,20-verde6,30-rosa6,80-aqua6,200-rojo7,10-azul7,20-verde7,30-rosa7,80-aqua7,200-rojo8,10-azul8,20-verde8,30-rosa8,80-aqua8,200-rojo9,10-azul9,20-verde9,30-rosa9,80-aqua9,200"

    // OBJ inicial si o si debe de estar
    myBarchart = new BarChart({
      canvas,
      seriesName: 'Vinyl records',
      seriesNameY: 'eje y',
      seriesNameX: 'eje x',
      padding: 40,
      gridStep: 5,
      gridColor: 'black',
      data: {
        'Classical Music': 16,
        'Alternative Rock': 12,
        Pop: 18,
        Jazz: 32
      },

      // en colors puede ir bien una lista larga por default
      colors: ['#000000', '#000000', '#000000'],
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

    // grafico de inicio(por default)
    // myBarchart.draw() // se manda a dibujar todo el objeto(grafico de barras)

    // lo que importa de verdad
    draw(myBarchart, tituloBarra0, ejeYname0, ejeXname0, listaDatos0)
  }, [data, draw, tituloBarra0, ejeYname0, ejeXname0, listaDatos0])

  // dibujar linea en canvas
  function drawLine (ctx, startX, startY, endX, endY, color) {
    ctx.save()
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.restore()
  }

  // dibujar barra en canvas
  function drawBar (
    ctx,
    upperLeftCornerX,
    upperLeftCornerY,
    width,
    height,
    color, value, puntoX,valorAnalogico
  ) {
    ctx.save()
    ctx.fillStyle = color
    ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height)
    ctx.restore()

    // ctx.fillStyle = color;
    // ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
    ctx.restore()

    // --------new
    ctx.save()
    ctx.translate(upperLeftCornerX + 9, puntoX)
    ctx.rotate(-0.5 * Math.PI)

    ctx.fillStyle = 'red'
    ctx.font = '12px serif'// "bold 12px serif"
    ctx.fillText(value, 10, 0)

    ctx.restore()

    // ---------new name de barra inclinado
    // nombre de barra
    ctx.save()
    ctx.translate(upperLeftCornerX + 5, upperLeftCornerY)
    ctx.rotate(-(Math.PI / 4))
    ctx.fillStyle = 'black'
    ctx.textAlign = 'left'
    ctx.fillText(valorAnalogico, 15, 0)
    ctx.restore()
  }

  // objeto canvas para el grafico de barras
  class BarChart {
    constructor (options) { // constructor del BarChart
      this.options = options
      this.canvas = options.canvas
      this.ctx = this.canvas.getContext('2d')
      this.colors = options.colors
      this.titleOptions = options.titleOptions
      this.maxValue = Math.max(...Object.values(this.options.data))

      // creamos la lista que identifica a c/u de las barras del grafico

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

      // identificador de esta lista de c/u de las barras en el grafico

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

    // inician los metodos de esta clase (metodos graficos)
    // 1
    drawGridLines () { // dibuja las lineas horizontales para identificar o darle un fondo mas legible respecto a los valores en el eje y
      const canvasActualHeight = this.canvas.height - this.options.padding * 2
      const canvasActualWidth = this.canvas.width - this.options.padding * 2
      let gridValue = 0
      console.log(this.maxValue)

      const numberOfBars = Object.keys(this.options.data).length// saber el max num de elemntos ==SI
      let contador = 0// elemento 0 ==NO

      while (gridValue <= this.maxValue) {
        const gridY =
          canvasActualHeight * (1 - gridValue / this.maxValue) +
          this.options.padding
        if (gridValue == 0) {
          drawLine(// barra horizontal del eje x
            this.ctx,
            17,
            gridY,
            this.canvas.width,
            gridY,
            this.options.gridColor
          )
        } else if (gridValue == this.maxValue) {
          drawLine(// barra horizontal del eje x
            this.ctx,
            17,
            gridY,
            this.canvas.width - 1230,
            gridY,
            this.options.gridColor
          )
        }
        drawLine(// barra vertical del eje y
          this.ctx,
          24,
          this.options.padding / 2,
          24,
          gridY + this.options.padding / 2,
          this.options.gridColor
        )
        // Writing grid markers son los numeros por linea   SE MODIFICO
        this.ctx.save()

        /*
        if(contador==0){
        this.ctx.fillStyle = "red";
        this.ctx.fillText(/ *Math.round(gridValue)+* /" NO", 0, gridY + 4);

        }else if((contador)==numberOfBars){
          this.ctx.fillStyle = "red";
          this.ctx.fillText(/ *Math.round(gridValue)+* /" SI", 0, gridY + 4);

        }else{
          this.ctx.fillStyle = "blue";
        } */

        this.ctx.fillStyle = 'red'
        this.ctx.textBaseline = 'bottom'
        this.ctx.font = 'bold 10px Arial'
        this.ctx.fillText(Math.round(gridValue) + '', 0, gridY + 4)
        this.ctx.restore()
        gridValue += this.options.gridStep

        contador++// para identificar 0s y 1s
      }
    }

    // 2
    drawBars () { // dibuja todas las barras del canvas se auto-ajusta
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
        // console.log(barHeight);
        drawBar(
          this.ctx,
          this.options.padding + barIndex * barSize,
          this.canvas.height - barHeight - this.options.padding,
          barSize,
          barHeight,
          this.colors[0], array[contador], // new  le envio valor a mostrar en la barra
          this.canvas.height - 15,val
        )
        barIndex++
        contador++
      }
    }

    // 3
    drawLabel () { // dibuja el titulo del grafico
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`
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

    drawLabelY () { // dibuja el titulo del eje y
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`
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

    drawLabelX () { // dibuja el titulo del eje x
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`
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

    drawLabel2 () { // dibuja el #muestras del grafico
      this.ctx.save()
      this.ctx.textBaseline = 'bottom'
      this.ctx.textAlign = this.titleOptions.align
      this.ctx.fillStyle = this.titleOptions.fill
      this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`
      let xPos = this.canvas.width / 2
      if (this.titleOptions.align == 'left') {
        xPos = 10
      }
      if (this.titleOptions.align == 'right') {
        xPos = this.canvas.width - 10
      }

      // numero de elementos del grafico
      const values = Object.values(this.options.data)

      this.ctx.fillText('Muestra:' + values.length, xPos, this.canvas.height)
      this.ctx.restore()
    }

    // el metodo que importa xd (manda a llamar a todos los anteriores)
    draw () { // manda a dibujar todo en el canvas grafico-barras
      this.drawGridLines()// dibuja el lineado del grafico
      this.drawBars()// las barras
      this.drawLabel()// el titulo del grafico
      this.drawLabel2()// el num de muestra
      this.drawLabelY()// nombre eje y
      this.drawLabelX()// nombre eje x
      // this.drawLegend()// nombre de cada barra de color
    }
  }

  //* ************************************************************************************************************* */
  //* ************************************************************************************************************* */

  // borra todo(limpia la pantalla)
  function reset () {
    // borro el grafico de barras
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function draw (myBarchart, tituloBarra, ejeYname, ejeXname, listaDatos) {
    console.log('-----------------------------------------------------')
    console.log('titulo: ' + tituloBarra + ' ejeY: ' + ejeYname + ' ejeX: ' + ejeXname + ' datos: [' + listaDatos + ']')
    console.log('-----------------------------------------------------')

    // los params se los paso a las var globales para cuando se llame a la funcion window.resize sea la misma a la ingresada
    tituloBarra0 = tituloBarra
    ejeYname0 = ejeYname
    ejeXname0 = ejeXname
    listaDatos0 = listaDatos

    // options es el atributo que nos importa con este modificamos lo que le enviamos
    // en el constructor del BarChart
    myBarchart.options.seriesName = tituloBarra
    myBarchart.options.seriesNameY = ejeYname
    myBarchart.options.seriesNameX = ejeXname

    // borro el grafico anterior para graficar el nuevo
    reset()

    const values = listaDatos.split('-')// caracter de separacion

    // creo el array
    const countries = []

    for (let i = 0; i < values.length; i++) {
      const values2 = values[i].split(',')
      console.log('ejeX:' + values2[0] + ' ejeY:' + values2[1])
      // armo el objeto y lo meto al array
      countries.push({ medida: values2[0], valor: values2[1] })
    }

    // convierto el array a OBJ
    const final = convertArrayToObject(countries, 'medida')// paso de array a objeto
    console.log(final)

    // se lo asigno a myBarchart options.data
    myBarchart.options.data = final

    // calculo de nuevo el max valor del data
    myBarchart.maxValue = Math.max(...Object.values(myBarchart.options.data))

    // defino el valor por linea hasta el max en este caso 1 dado a SI o NO
    myBarchart.options.gridStep = 1
    // ----------------------------------------------------------------
    // se manda a dibujar todo el objeto(grafico de barras)
    myBarchart.draw()
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
        <div className="flex-1 p-15">
          <canvas ref={canvasRef} width={1500} height={1500} >
          </canvas>
          <legend htmlFor="myCanvas"></legend>
        </div>
      </section>
    </>
  )
}
