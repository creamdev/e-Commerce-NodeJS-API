
const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    name:String,
    password:String,
    email:String,
    verified:{
        type:Boolean,
        default:false
    }
})

module.exports=Mongoose.model('User',UserSchema)