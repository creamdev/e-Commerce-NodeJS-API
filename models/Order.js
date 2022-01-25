const Mongoose = require('mongoose');

const OrderSchema = Mongoose.Schema({
    orderItems :[{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'OrderItem',
        required:true
    }],
    shippingAddress:String,
    city:String,
    zip:String,
    country:String,
    phone:String,
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice:Number,
    user:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
})

module.exports= Mongoose.model('Order', OrderSchema);