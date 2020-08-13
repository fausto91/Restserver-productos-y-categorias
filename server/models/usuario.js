const mongoose = require('mongoose');
const uniqueValidator =require('mongoose-unique-validator');


let rolesValidos ={
    values: ['ADMIN_ROLE','USER_ROLE'],
    message:' {VALUE} NO ES UN ROLE VALIDO'
};
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type:String,
        required: [true,'El nombre es necesario']  
    },

    email:{
        type: String,
        unique: true,
        required:[true,'El Email es necesario']
    },

    password:{
        type:String,
        required:[true, ' El Password es necesario']
    },

    img:{
        type: String,
        required:false
    },

    role:{
        type:String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },

    estado:{
        type:Boolean,
        default: true
    },

    google:{
        type:Boolean,
        default:false
    }
});

// Metodo para que no muestre el objeto de la contraseña en una impresion 
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;

}

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} DEBE DE SER UNICO'})


module.exports = mongoose.model('Usuario', usuarioSchema);