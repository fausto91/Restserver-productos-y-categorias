const express = require('express');
let{verificarToken, VerificarAdmin_Role}= require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');





// Mostrar todas las categorias
app.get('/categoria',verificarToken,(req,res)=>{

    Categoria.find({})
    
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err,categoria)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        Categoria.countDocuments({}, (err,conteo)=>{

            res.json({
                ok:true,
                categoria,
                cuantos:conteo
            });

        });
    });
});

// Mostrar una categoria
app.get('/categoria/:id', verificarToken, (req,res)=>{
    
    let id=req.params.id;

    Categoria.findById(id,(err,categoriaDB) =>{
        
        if (err){
            return res.status(500).json({
                ok:false,
                err:{
                    message: 'El ID es invalido '
                }
                
                
            });
        }

        if (!categoriaDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:'El ID no existe en la base de datos'
                }
            });
        }

        res.json({
            ok:true,
            categoria:categoriaDB
        });

    });

    
});


// crear nuevs categoria
// regresa la nueva categoria

app.post('/categoria',verificarToken,(req,res) =>{
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            categoria:categoriaDB
        });

    });

});

app.put('/categoria/:id',verificarToken,(req,res)=>{

    let id=req.params.id;
    let body = req.body;
    let desCategoria = {
        descripcion:body.descripcion
    }

    Categoria.findByIdAndUpdate(id,desCategoria,{new:true, runValidators:true},(err,categoriaDB)=>{

        if (err){
            return res.status(500).json({
                ok:false,
                err
                   
                
            });
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
                 
                
            });
        };
         res.json({
             ok:true,
             categoria:categoriaDB
         })

    });


});

app.delete('/categoria/:id',[verificarToken,VerificarAdmin_Role], (req,res)=>{

    let id = req.params.id;
    
    Categoria.findByIdAndDelete(id,(err,categoriaDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'qp2'
                }
            });
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El ID no existe'
                }
            });
        };

        res.json({
            ok:true,
              
            message:'Usuario borrado'
        })

    });




});


module.exports= app;


