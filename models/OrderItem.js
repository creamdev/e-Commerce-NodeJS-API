const Mongoose = require('mongoose')

const OrderItemSchema = Mongoose.Schema({
    quantity:{
        type : Number,
        required:true
    },
    product:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
})
 
module.exports= Mongoose.model('OrderItem', OrderItemSchema);