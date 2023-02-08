const { Schema, model } = require('mongoose');

const DatosSchema = Schema(
    {
        temp: {
            type: Number,
            required: true
        },
        hum: {
            type: Number,
            required: true
        },
        vel: {
            type: Number,
            required: true
        },
        dir: {
            type: String,
            required: true
        },
        pre: {
            type: Number,
            required: true
        },
    },
    {
        versionKey: false,
    }
);

exports.Datos = model('Datos', DatosSchema);