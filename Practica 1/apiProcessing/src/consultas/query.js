const { Datos } = require("../models/data.js");

exports.consulta1 = async (req, res) => {
    try {
        const data = await Datos.find({}, { _id: 0 }).sort({ _id: -1 }).limit(1);
        res.json(data[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            temp: 0,
            hum: 0,
            vel: 0,
            dir: " ",
            pre: 0,
        });
    }
}

exports.consulta2 = async (req, res) => {
    try {
        let fechaInicio, fechaFin;
        let params = Object.fromEntries(new URLSearchParams(req.query));
        // Verifica si se proporcionó fecha de inicio
        if (params.fechaInicio !== "") {
            const partesFecha = req.body.fechaInicio.split('/');
            fechaInicio = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
            fechaInicio.setHours(0, 0, 0, 0);
        } else {
            let info = await Datos.find({}, { _id: 0 }).limit(1);
            fechaInicio = new Date(info[0].date);
            fechaInicio.setHours(0, 0, 0, 0);
        }

        // Verifica si se proporcionó fecha de fin
        if (params.fechaFin !== "") {
            const partesFecha = req.body.fechaFin.split('/');
            fechaFin = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
            fechaFin.setHours(17, 59, 59, 999);
        } else {
            fechaFin = new Date();
            fechaFin.setHours(23, 59, 59, 999);
        }

        const data = await Datos.find({
            date: {
                $gte: fechaInicio,
                $lte: fechaFin
            }
        }, { _id: 0 });

        if (data.length === 0) {
            return res.status(404).json({
                mensaje: "No se encontraron datos para las fechas especificadas."
            });
        }
        res.json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            temp: 0,
            hum: 0,
            vel: 0,
            dir: " ",
            pre: 0,
        });
    }
}

//enviar datos a la base de datos
exports.enviarDatos = async (req, res) => {
    try {
        const data = new Datos(req.body);
        await data.save();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            temp: 0,
            hum: 0,
            vel: 0,
            dir: " ",
            pre: 0,
        });
    }
}


