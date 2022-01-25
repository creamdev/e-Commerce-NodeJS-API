
const Mongoose = require('mongoose');

const TokenSchema = new Mongoose.Schema({
    userId:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true,
    },

})

module.exports=Mongoose.model('Token',TokenSchema)