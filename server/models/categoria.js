const moongoose = require('mongoose')
const Schema = moongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {type:String, unique: true,required:[true, 'La descripcion es obligatoria']},
    usuario: {type:Schema.Types.ObjectId,ref:'Usuario'}
});

module.exports = moongoose.model('Categoria',categoriaSchema);

