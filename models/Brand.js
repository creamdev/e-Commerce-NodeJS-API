const Mongoose = require('mongoose');

const BrandSchema = new Mongoose.Schema({
    name:String,
    image:String
})

module.exports=Mongoose.model('Brand',BrandSchema)