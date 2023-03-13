//supuestamente con la grafica

var tituloBarra0="eje x vs eje y", ejeYname0="pomodoro", ejeXname0="tiempo(s)", listaDatos0="rojo,1-azul,2-verde,3"

//inicio   ==================================================================

var myCanvas;
var myBarchart;
var ctx;

var myCanvas = document.getElementById("myCanvas");
myCanvas.width = window.innerWidth * 0.95;   //ancho del marco canvas   550
myCanvas.height = window.innerHeight * 0.85;  // =alto del marco canvas   550

var ctx = myCanvas.getContext("2d");

// *****************************************************************
// *****************************************************************
// *****************************************************************
document.body.style.padding = "0px"
document.body.style.margin = "0px"

window.onresize = function () {
  resizeCanvas()


  //var tituloBarra0, ejeYname0, ejeXname0, listaDatos0

  /*
  var param = tituloBarra0
  var paramY = ejeYname0
  var paramX = ejeXname0

  var n2 = document.getElementById("num").value;*/

  draw(tituloBarra0, ejeYname0, ejeXname0, listaDatos0)
}

function resizeCanvas() {
  myCanvas.width = window.innerWidth * 0.95
  myCanvas.height = window.innerHeight * 0.85

}

function SUMMIT() {
  resizeCanvas()

  var param = "penalizacion de pomodoro"
  var paramY = "segundos(s)"
  var paramX = "pomodoros(p)"

  var n2 = document.getElementById("num").value;

  draw(param, paramY, paramX, n2)
}


function drawLine(ctx, startX, startY, endX, endY, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

function drawBar(
  ctx,
  upperLeftCornerX,
  upperLeftCornerY,
  width,
  height,
  color, value, puntoX
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
  ctx.restore();



  // ctx.fillStyle = color;
  // ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
  ctx.restore();

  //--------new
  this.ctx.save();
  this.ctx.translate(upperLeftCornerX+9, puntoX-5);
  this.ctx.rotate(-0.5 * Math.PI);

  this.ctx.fillStyle = "#181818";
  this.ctx.font = "12px serif" //"bold 12px serif"
  this.ctx.fillText(value, 0, 0);

  this.ctx.restore();

  
}

//analizado
class BarChart {
  constructor(options) { //constructor del BarChart
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    this.titleOptions = options.titleOptions;
    this.maxValue = Math.max(...Object.values(this.options.data));

    //creamos la lista que identifica a c/u de las barras del grafico
    this.ul = document.createElement("ul");
    this.ul2 = document.createElement("ul");
    this.ul3 = document.createElement("ul");

    this.ul4 = document.createElement("ul");
    this.ul5 = document.createElement("ul");
    this.ul6 = document.createElement("ul");

    this.ul7 = document.createElement("ul");
    this.ul8 = document.createElement("ul");
    this.ul9 = document.createElement("ul");

    //this.ul.className="social-icons"


    //identificador de esta lista de c/u de las barras en el grafico
    this.ul.id = "legends"
    this.ul2.id = "legends2"
    this.ul3.id = "legends3"

    this.ul4.id = "legends4"
    this.ul5.id = "legends5"
    this.ul6.id = "legends6"

    this.ul7.id = "legends7"
    this.ul8.id = "legends8"
    this.ul9.id = "legends9"
  }

  //inician los metodos de esta clase (metodos graficos)
  //1
  drawGridLines() {//dibuja las lineas horizontales para identificar o darle un fondo mas legible respecto a los valores en el eje y
    var canvasActualHeight = this.canvas.height - this.options.padding * 2;
    var canvasActualWidth = this.canvas.width - this.options.padding * 2;
    var gridValue = 0;
    console.log(this.maxValue)
    while (gridValue <= this.maxValue) {
      var gridY =
        canvasActualHeight * (1 - gridValue / this.maxValue) +
        this.options.padding;
      drawLine(//barra horizontal del eje x
        this.ctx,
        17,
        gridY,
        this.canvas.width,
        gridY,
        this.options.gridColor
      );
      drawLine(//barra vertical del eje y
        this.ctx,
        24,
        this.options.padding / 2,
        24,
        gridY + this.options.padding / 2,
        this.options.gridColor
      );
      // Writing grid markers son los numeros por linea
      this.ctx.save();
      this.ctx.fillStyle = "red";
      this.ctx.textBaseline = "bottom";
      this.ctx.font = "bold 10px Arial";
      this.ctx.fillText(Math.round(gridValue), 0, gridY + 4);
      this.ctx.restore();
      gridValue += this.options.gridStep;
    }
  }
  //2
  drawBars() {// dibuja todas las barras del canvas se auto-ajusta
    var canvasActualHeight = this.canvas.height - this.options.padding * 2;
    var canvasActualWidth = this.canvas.width - this.options.padding * 2;
    var barIndex = 0;
    var numberOfBars = Object.keys(this.options.data).length;
    var barSize = canvasActualWidth / numberOfBars;
    var values = Object.values(this.options.data);

    var array = Object.keys(this.options.data)
    var contador = 0
    for (let val of values) {
      var barHeight = Math.round((canvasActualHeight * val) / this.maxValue);
      //console.log(barHeight);
      drawBar(
        this.ctx,
        this.options.padding + barIndex * barSize,
        this.canvas.height - barHeight - this.options.padding,
        barSize,
        barHeight,
        this.colors[barIndex % this.colors.length], array[contador],  //new  le envio valor a mostrar en la barra
        this.canvas.height - 15
      );
      barIndex++;
      contador++
    }
  }
  //3
  drawLabel() {//dibuja el titulo del grafico
    this.ctx.save();
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = this.titleOptions.align;
    this.ctx.fillStyle = this.titleOptions.fill;
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
    let xPos = this.canvas.width / 2;
    if (this.titleOptions.align == "left") {
      xPos = 10;
    }
    if (this.titleOptions.align == "right") {
      xPos = this.canvas.width - 10;
    }
    this.ctx.fillText(this.options.seriesName, xPos + 45, 18);
    this.ctx.restore();
  }
  drawLabelY() {//dibuja el titulo del eje y
    this.ctx.save();
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = this.titleOptions.align;
    this.ctx.fillStyle = this.titleOptions.fill;
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
    let xPos = this.canvas.width / 2;
    if (this.titleOptions.align == "left") {
      xPos = 10;
    }
    if (this.titleOptions.align == "right") {
      xPos = this.canvas.width - 10;
    }
    this.ctx.fillText(this.options.seriesNameY, 55, 18);
    this.ctx.restore();
  }
  drawLabelX() {//dibuja el titulo del eje x
    this.ctx.save();
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = this.titleOptions.align;
    this.ctx.fillStyle = this.titleOptions.fill;
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
    let xPos = this.canvas.width / 2;
    if (this.titleOptions.align == "left") {
      xPos = 10;
    }
    if (this.titleOptions.align == "right") {
      xPos = this.canvas.width - 10;
    }
    this.ctx.fillText(this.options.seriesNameX, this.canvas.width - 65, this.canvas.height - 1);
    this.ctx.restore();
  }
  drawLabel2() {//dibuja el #muestras del grafico
    this.ctx.save();
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = this.titleOptions.align;
    this.ctx.fillStyle = this.titleOptions.fill;
    this.ctx.font = `${this.titleOptions.font.weight} ${this.titleOptions.font.size} ${this.titleOptions.font.family}`;
    let xPos = this.canvas.width / 2;
    if (this.titleOptions.align == "left") {
      xPos = 10;
    }
    if (this.titleOptions.align == "right") {
      xPos = this.canvas.width - 10;
    }

    //numero de elementos del grafico
    var values = Object.values(this.options.data);

    this.ctx.fillText("Muestra:" + values.length, xPos, this.canvas.height);
    this.ctx.restore();
  }
  //4
  drawLegend() { // dibuja los cuadros de color con su label respectivo, identificador de que cosa representa cada una de las barras

    let pIndex = 0;
    let legend = document.querySelector("legend[for='myCanvas']");

    //identificador de esta lista de c/u de las barras en el grafico

    legend.append(this.ul);
    legend.append(this.ul2);
    legend.append(this.ul3);

    legend.append(this.ul4);
    legend.append(this.ul5);
    legend.append(this.ul6);

    legend.append(this.ul7);
    legend.append(this.ul8);
    legend.append(this.ul9);

    var ulActual = this.ul

    //obtengo los valores de data
    var valores = Object.values(this.options.data)
    var contador = 0//contador para recorrer ese array de valores 

    var contador2 = 1//contador para recorrer ese array de valores 

    for (let ctg of Object.keys(this.options.data)) {

      //esto es con el fin de no irse a +x infinito xd
      if (25 % contador == 0 && contador == 25) {
        ulActual = this.ul2
      } else if (50 % contador == 0 && contador == 50) {
        ulActual = this.ul3
      } else if (75 % contador == 0 && contador == 75) {
        ulActual = this.ul4
      } else if (100 % contador == 0 && contador == 100) {
        ulActual = this.ul5
      } else if (125 % contador == 0 && contador == 125) { 
        ulActual = this.ul6

      }else if (150 % contador == 0 && contador == 150) { 
        ulActual = this.ul7
      }else if (175 % contador == 0 && contador == 175) { 
        ulActual = this.ul8
      }else if (200 % contador == 0 && contador == 200) { // 50 ciclos de pomodoros totales los que aguanta
        ulActual = this.ul9
      }

      let li = document.createElement("li");
      li.style.listStyle = "none";

      // li.style.display="inline"

      li.style.borderLeft =
        "20px solid " + this.colors[pIndex % this.colors.length];
      li.style.padding = "-2px";

      if (contador % 4 == 0) {
        li.textContent = "Pomodoro"+contador2 + ") " + ctg + ":" + valores[contador] + "";
        contador2++
      }else{
        li.textContent = "" + ctg + ":" + valores[contador] + "";
      }

      

      contador++
      
      ulActual.append(li);

      //podeeer
      ulActual.style.position = "relative"
      ulActual.style.left = "5px"//margen izq

      pIndex++;
    }
  }

  //el metodo que importa xd (manda a llamar a todos los anteriores)
  draw() {//manda a dibujar todo en el canvas grafico-barras
    this.drawGridLines();//dibuja el lineado del grafico
    this.drawBars();//las barras
    this.drawLabel();//el titulo del grafico
    this.drawLabel2();//el num de muestra
    this.drawLabelY()//nombre eje y
    this.drawLabelX()//nombre eje x
    this.drawLegend();//nombre de cada barra de color
  }
}

//---------------------------------------------inicializacion

//OBJ inicial si o si debe de estar
var myBarchart = new BarChart({
  canvas: myCanvas,
  seriesName: "Vinyl records",
  seriesNameY: "eje y",
  seriesNameX: "eje x",
  padding: 40,
  gridStep: 5,
  gridColor: "black",
  data: {
    "Classical Music": 16,
    "Alternative Rock": 12,
    Pop: 18,
    Jazz: 32
  },

  //en colors puede ir bien una lista larga por default
  colors: ["#D8D8D8", "#FA0F0F", "#FA8C0F", "#FACC0F", "#ECFA0F", "#A5FA0F", "#61FA0F", "#0FFA7D", "#0FFAD3", "#0FFAFA", "#0FC5FA", "#0F96FA", "#0F5DFA", "#0F0FFA", "#5D0FFA", "#9D0FFA", "#DA0FFA", "#FA0FE1", "#FA0FAF", "#FA0F5D", "#B20000", "#B24600", "#B28F00", "#AAB200", "#59B200", "#00B20B", "#00B27C", "#00B2B2", "#009AB2", "#0069B2", "#003BB2", "#2000B2", "#6F00B2", "#AD00B2", "#999898"],
  titleOptions: {
    align: "center",
    fill: "black",
    font: {
      weight: "bold",
      size: "18px",
      family: "Lato"
    }
  }
});

//grafico de inicio(por default)
myBarchart.draw();  // se manda a dibujar todo el objeto(grafico de barras)


//--------- se vienen mis funciones de los botones ---------======================================================================

//borra todo(limpia la pantalla)
function reset() {

  //borro el grafico de barras
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //borro las leyendas del grafico
  var leyendas = document.getElementById('legends');
  leyendas.innerHTML = "";

  for (let index = 2; index <= 9; index++) {
    leyendas = document.getElementById('legends'+index);
    leyendas.innerHTML = "";
    
  }

}

//=================================================================================================================================
//=================================================================================================================================
//=================================================================================================================================
//=================================================================================================================================


function draw(tituloBarra, ejeYname, ejeXname, listaDatos) {

  //los params se los paso a las var globales para cuando se llame a la funcion window.resize sea la misma a la ingresada
  tituloBarra0 = tituloBarra
  ejeYname0 = ejeYname
  ejeXname0 = ejeXname
  listaDatos0 = listaDatos


  //options es el atributo que nos importa con este modificamos lo que le enviamos
  //en el constructor del BarChart
  myBarchart.options.seriesName = tituloBarra
  myBarchart.options.seriesNameY = ejeYname
  myBarchart.options.seriesNameX = ejeXname

  //borro el grafico anterior para graficar el nuevo
  reset()

  var values = listaDatos.split('-');//caracter de separacion

  //creo el array
  const countries = [];

  for (var i = 0; i < values.length; i++) {
    var values2 = values[i].split(',');
    console.log("ejeX:" + values2[0] + " ejeY:" + values2[1])
    //armo el objeto y lo meto al array
    countries.push({ ['medida']: values2[0], ['valor']: values2[1] })
  }

  //convierto el array a OBJ
  var final = convertArrayToObject(countries, 'medida',)//paso de array a objeto
  console.log(final);

  //se lo asigno a myBarchart options.data
  myBarchart.options.data = final

  //calculo de nuevo el max valor del data
  myBarchart.maxValue = Math.max(...Object.values(myBarchart.options.data));

  //defino el valor por linea hasta el max
  myBarchart.options.gridStep = myBarchart.maxValue / values.length


  //----------------------------------------------------------------
  // se manda a dibujar todo el objeto(grafico de barras)
  myBarchart.draw();

}


//pasa de array a OBJ
const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: Number(item.valor),
    };
  }, initialValue);
};















