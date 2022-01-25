const Mongoose = require('mongoose');
const logger = require('../scripts/logger/Product')


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

ProductSchema.post("save",(doc)=>{
    logger.log({
        level:"info",
        message:doc
    });
});

module.exports=Mongoose.model('Product',ProductSchema)