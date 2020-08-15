const mongoose = require('mongoose');
const Schema =mongoose.Schema;

let PedidoSchema = Schema({
    
    nombre:{
        type:String,
        require: [true, 'El nombre es necesario']
    },
    
    direccion:{
        type:String,
        required:[true, 'La direccion es necesario']
    },
    
    descripcion:{
        type:String,
        required:false
        
    },
    usuario:{
        type:Schema.Types.ObjectId,ref:'Usuario',
        required:[true,'El usuario es requerido'],
        
    },
    
    categoria:{
        type:Schema.Types.ObjectId,ref:'Categoria',
        required: [true, 'La categoria es necesario ']
    }
});
module.exports=mongoose.model('Pedido',PedidoSchema);