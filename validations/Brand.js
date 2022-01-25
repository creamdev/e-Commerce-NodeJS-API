const Joi = require('joi');


const createValidation= Joi.object({
    name:Joi.string().max(20).required(),
    image:Joi.string().required()
})

module.exports={createValidation}