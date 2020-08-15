const express=require('express');
let {verificarToken}=require('../middlewares/autenticacion');

let app= express();
let Pedido =require('../models/pedido');
const e = require('express');

app.get('/pedido', verificarToken,async(req,res)=>{

    await Pedido.find({})
    .sort('nombre')
    .populate('usuario', 'nombre')
    .populate('categoria','descripcion')
    .exec((err,pedidoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        Pedido.countDocuments((err,conteo)=>{
            
            return res.json({
                pedidoDB,
                cuantos:conteo
            });
        })
    })

});

app.get('/pedido/:id',verificarToken,async(req,res)=>{
    let id=req.params.id

    await Pedido.findById(id)

    .populate('usuario','nombre')
    .populate('categoria','descripcion')
    .exec((err,pedidoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                message:'El ID es invalido'
                }
            });

        }

        if(!pedidoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El ID no existe en la base de datos'
                }
            });
        }

        return res.json({pedidoDB})
    })
    
})


app.post('/pedido', verificarToken,(req,res)=>{

    let body= req.body;
    let pedido = new Pedido({
        categoria:body.categoria,
        nombre:body.nombre,
        direccion:body.direccion,
        descripcion:body.descripcion,
        usuario:req.usuario._id,

    });

    pedido.save((err,pedidoDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if (!pedidoDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.status(201).json({
            ok:true,
            pedido:pedidoDB
        })
    });

});

app.put('/pedido/:id',verificarToken,async(req,res)=>{
    let id=req.params.id;
    let body=req.body;
    let updatePed ={
        nombre:body.nombre,
        categoria:body.categoria,
        direccion:body.direccion,
        descripcion:body.descripcion,
        usuario:body.usuario,
    }
    
    await Pedido.findByIdAndUpdate(id,updatePed,{new:true, runValidators:true})

    .populate('usuario','nombre')
    .populate('categoria','descripcion')
    .exec((err,pedidoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                message:'El ID es invalido'
                }
            });

        }

        if(!pedidoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El ID no existe en la base de datos'
                }
            });
        }

        return res.json({pedidoDB,
        
        })
    })
 
        
    
            
})

app.delete('/pedido/:id',verificarToken,async(req,res)=>{
    let id=req.params.id

    await Pedido.findByIdAndDelete(id)

    .populate('usuario','nombre')
    .populate('categoria','descripcion')
    .exec((err,pedidoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err:{
                message:'El ID es invalido'
                }
            });

        }

        if(!pedidoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El ID no existe en la base de datos'
                }
            });
        }

        return res.json({pedidoDB,
        message:'Usuario borrado'
        })
    })
    
})


module.exports=app;