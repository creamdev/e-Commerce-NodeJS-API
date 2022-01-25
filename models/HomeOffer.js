const Mongoose = require('mongoose');

const HomeOfferSchema = new Mongoose.Schema({
    image:String
})

module.exports=Mongoose.model('HomeOffer',HomeOfferSchema)