const express = require('express');
const app = express();
const _ = require('underscore');
const Usuario = require('../models/usuario')


app.get('/usuario', function(req, res) {
    Usuario.find({})
        .exec((err, usuarios) => {
            if (err) {
                res.status(400).json({
                    mensaje: 'Ocurrió un error al solicitar el usuario',
                    err: err
                })
            } else {
                res.json({
                    ok: true,
                    usuarios
                });
            }
        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        role: body.role

    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'Ocurrió un error guardando al usuario, verifique los datos.'
            })
        } else {
            res.json({
                usuarioDB,
                mensaje: 'Usuario guardado correctamente.'
            });
        }
    })
})

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado,
            message: 'Usuario eliminado'
        });

    });
});

module.exports = app;