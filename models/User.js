
const Mongoose = require('mongoose');
const logger = require('../scripts/logger/User')

const UserSchema = new Mongoose.Schema({
    name:String,
    password:String,
    email:String,
    verified:{
        type:Boolean,
        default:false
    }
})

UserSchema.post("save",(doc)=>{
    logger.log({
        level:"info",
        message:doc
    });
});

module.exports=Mongoose.model('User',UserSchema)