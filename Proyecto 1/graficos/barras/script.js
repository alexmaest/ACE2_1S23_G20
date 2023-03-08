// *****************************************************************
// *****************************************************************
// *****************************************************************


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
  color
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
  ctx.restore();
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
    //identificador de esta lista de c/u de las barras en el grafico
    this.ul.id = "legends"
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
      this.ctx.fillText(gridValue, 0, gridY + 4);
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
    for (let val of values) {
      var barHeight = Math.round((canvasActualHeight * val) / this.maxValue);
      //console.log(barHeight);
      drawBar(
        this.ctx,
        this.options.padding + barIndex * barSize,
        this.canvas.height - barHeight - this.options.padding,
        barSize,
        barHeight,
        this.colors[barIndex % this.colors.length]
      );
      barIndex++;
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
    this.ctx.fillText(this.options.seriesName, xPos, 18);
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
    this.ctx.fillText(this.options.seriesNameY, 20, 18);
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
    this.ctx.fillText(this.options.seriesNameX, this.canvas.width - 45, this.canvas.height - 10);
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

    //obtengo los valores de data
    var valores = Object.values(this.options.data)
    var contador = 0//contador para recorrer ese array de valores

    for (let ctg of Object.keys(this.options.data)) {
      let li = document.createElement("li");
      li.style.listStyle = "none";
      li.style.borderLeft =
        "20px solid " + this.colors[pIndex % this.colors.length];
      li.style.padding = "5px";

      li.textContent = ctg + ":" + valores[contador];
      contador++
      this.ul.append(li);

      //podeeer
      this.ul.style.position = "relative"
      this.ul.style.left = "100px"

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


var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 550;   //ancho del marco canvas
myCanvas.height = 550;  // =alto del marco canvas

var ctx = myCanvas.getContext("2d");

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
  colors: ["#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", /* los demas son copy paste, esto se debe de cambiar y definir los colores para n barras */      "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743", "#a55ca5", "#67b6c7", "#bccd7a", "#eb9743"],
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

}

//=================================================================================================================================
//=================================================================================================================================
//=================================================================================================================================
//=================================================================================================================================
// ENTRADA SINTAXIS================================================================================================================
//3 datos
//rojo,1-azul,2-verde,3

//4 datos
//fifa,7-lol,6-mario,8-god of war,9

//5 datos
//rojo,10-azul,20-verde,30-rosa,80-aqua,200

//25 datos
//rojo,10-azul,20-verde,30-rosa,80-aqua,200-rojo1,10-azul1,20-verde1,30-rosa1,80-aqua1,200-rojo2,10-azul2,20-verde2,30-rosa2,80-aqua2,200-rojo3,10-azul3,20-verde3,30-rosa3,80-aqua3,200-rojo4,10-azul4,20-verde4,30-rosa4,80-aqua4,200

//50 datos
//rojo,10-azul,20-verde,30-rosa,80-aqua,200-rojo1,10-azul1,20-verde1,30-rosa1,80-aqua1,200-rojo2,10-azul2,20-verde2,30-rosa2,80-aqua2,200-rojo3,10-azul3,20-verde3,30-rosa3,80-aqua3,200-rojo4,10-azul4,20-verde4,30-rosa4,80-aqua4,200-rojo5,10-azul5,20-verde5,30-rosa5,80-aqua5,200-rojo6,10-azul6,20-verde6,30-rosa6,80-aqua6,200-rojo7,10-azul7,20-verde7,30-rosa7,80-aqua7,200-rojo8,10-azul8,20-verde8,30-rosa8,80-aqua8,200-rojo9,10-azul9,20-verde9,30-rosa9,80-aqua9,200


function draw() {

  var ejexName = document.getElementById("ejex").value; //el input area
  var ejeyName = document.getElementById("ejey").value; //el input area
  var titulo = document.getElementById("titulo").value; //el input area

  //options es el atributo que nos importa con este modificamos lo que le enviamos
  //en el constructor del BarChart
  myBarchart.options.seriesName = titulo
  myBarchart.options.seriesNameY = ejeyName
  myBarchart.options.seriesNameX = ejexName

  //borro el grafico anterior para graficar el nuevo
  reset()
  /* Accepting and seperating comma seperated values */
  var n = document.getElementById("num").value; //el input area
  // n.replace("(", "")
  // n.replace(")", "")
  var values = n.split('-');//caracter de separacion

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

//de array a objeto
//https://dev.to/afewminutesofcode/how-to-convert-an-array-into-an-object-in-javascript-25a4#:~:text=To%20convert%20an%20array%20into%20an%20object%20we%20will%20create,key%20we%20have%20passed%20in.









