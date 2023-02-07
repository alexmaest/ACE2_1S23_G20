const { Datos } = require("../models/data.js");

exports.consulta1 = async (req, res) => {
    try {
        const data = await Datos.find({},{_id:0}).sort({ _id: -1 }).limit(1);
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