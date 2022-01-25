const Joi = require('joi');


const createValidation= Joi.object({
    orderItems :Joi.required(),
    shippingAddress:Joi.required(),
    city:Joi.required(),
    zip:Joi.required(),
    country:Joi.required(),
    phone:Joi.required(),
    status:Joi.required()
})

module.exports={createValidation}