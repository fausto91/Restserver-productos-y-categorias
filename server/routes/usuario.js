
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const {verificarToken,VerificarAdmin_Role }= require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificarToken,  (req, res) => {

    // parametros opcionales 
    let desde = req.query.desde || 0;
    desde=Number(desde);
    
    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Usuario.find({estado:true},'nombre email role estado google img')
      .skip(desde)  //SALTA LOS PRIMEROS 5 REGISTROS *** puesdes colocar un numero para la cantidad de registros 
      .limit(limite) // MUESTRA LOS SIGUIENTES 5 REGISTROS 
        .exec((err, usuarios)=>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({estado:true}, (err, conteo)=>{
                
                res.json({
                    ok:true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });
    
    });


  app.post('/usuario', [verificarToken,VerificarAdmin_Role], function (req, res) {
      let body= req.body;
      
      
      let usuario = new Usuario({
          nombre:body.nombre,
          email:body.email,
          password: bcrypt.hashSync(body.password, 10), 
            // img:body.img
            role:body.role
        });

        usuario.save((err,usuarioDB) =>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            } 
            // usuarioDB.password = null;  pone en null el
            res.json({
                   ok:true,
                   usuario: usuarioDB
                });

            });
            
        });
        
app.put('/usuario/:id', [verificarToken,VerificarAdmin_Role], function (req, res) {
            
            let id=req.params.id;
            let body = _.pick(req.body, ['nombre','email','img', 'role', 'estado'] );

            //delete body.password;
            //delete body.google;

            Usuario.findByIdAndUpdate(id, body, {new:true,runValidators: true},(err,usuarioDB)=>{

        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }; 

        
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
    
});
app.delete('/usuario/:id', [verificarToken,VerificarAdmin_Role], function (req, res) {
    
    let id =req.params.id;
    
    //Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
        let cambiaEstado ={
            estado:false
        };
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado)=>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        
        if (!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'usuario no encontrado'
                }
            });
        }
        res.json({
            ok:true,
            usuario: usuarioBorrado
        });
    });

  });

 module.exports=app;