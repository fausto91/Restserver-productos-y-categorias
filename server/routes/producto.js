const express = require('express');
let {verificarToken} = require('../middlewares/autenticacion');

let app= express();
let Producto = require('../models/producto');

//Obtiene todos los productos

app.get('/producto', verificarToken,(req,res)=>{
    let desde = req.query.desde || 0;
    desde = Number (desde);
    let limite =req.query.limite || 5;
    limite =Number(limite);

    Producto.find({disponible:true})
    .skip(desde)
    .limit(limite)
    .sort( 'producto nombre')
    .populate('usuario', 'nombre email')
    .populate('categoria','descripcion')
    
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        Producto.countDocuments({disponible:true},(err,conteo)=>{
            res.json({
                ok:true,
                producto:productoDB,
                cuantos:conteo,

            });

        });

    });


});

//Obtiene un producto por ID

app.get('/producto/:id', verificarToken,(req,res)=>{

    let id = req.params.id; 
    
    //  let disponible ={
    //      disponible:body.disponible
    //  }

     
     
     Producto.findById(id)

     
     .populate('usuario','nombre email')
     .populate('categoria','nombre')
     .exec((err,productoDB)=>{
         
         console.log(productoDB.disponible);

        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                   message: ' El Id es invalido'
                }
            })  
        }
        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El ID no existe en la base de datos'
                }
            })
        }
        if(productoDB.disponible===false){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'El producto no esta disponible'
                }
            })
        }
        
        res.json({
            ok:true,
            producto:productoDB
        })

    });



});

app.get('/producto/buscar/:termino', verificarToken,(req,res)=>{

    let termino =req.params.termino;
    let regex =new RegExp(termino, 'i');

    Producto.find({nombre:regex,disponible:true})
    .populate('categoria','nombre')

    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        Producto.countDocuments({nombre:regex,disponible:true},(err,conteo)=>{
            res.json({
                ok:true,
                productoDB,
                cuantos:conteo
            })

        })

    })




});


// Crea un producto
app.post('/producto',verificarToken,(req,res)=>{
    let body= req.body;

    let producto = new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id,
        
    });

        producto.save((err,productoDB)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            if(!productoDB){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            res.status(201).json({
                ok:true,
                producto:productoDB,

            })

        });


});

//Actualiza un producto por ID 
app.put('/producto/:id',verificarToken,(req,res)=>{
    let id = req.params.id;
    let body=req.body;
    let updateProd ={
        nombre:body.nombre,
        precioUni:body.precioUni,
        usuario:body.usuario,
        categoria:body.categoria,
        disponible:body.disponible,
        descripcion:body.descripcion
    }
    Producto.findByIdAndUpdate(id,updateProd,{new:true,runValidators:true},(err,productoDB)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });

        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'El ID no existe'
                }

            });

            
        }

        res.json({
            ok:true,
            producto:productoDB,
        })



    });
});

// Elimina un producto
app.delete('/producto/:id', verificarToken, function (req,res) {

    let id = req.params.id;

    let cambioDisp = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id,cambioDisp,{new:true},(err,productoDB)=>{

        if (err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            producto:productoDB,
            message:'Producto Borrado'
        });

    });
});

module.exports=app;