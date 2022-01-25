const Mongoose = require('mongoose');


const ProductSchema =new Mongoose.Schema({
    name:String,
    description:String,
    price:Number,
    stock:String,
    image:String,
    category:{
        type:Mongoose.Types.ObjectId,
        ref:'Category'
    },
    brand:{
        type:Mongoose.Types.ObjectId,
        ref:'Brand'
    }
})

module.exports=Mongoose.model('Product',ProductSchema)