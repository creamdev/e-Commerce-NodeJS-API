const Mongoose = require('mongoose');

const CategorySchema = new Mongoose.Schema({
    name:String
})

module.exports= Mongoose.model('Category', CategorySchema)