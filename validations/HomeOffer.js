const Joi = require('joi');


const createValidation= Joi.object({
    image:Joi.required()
})


module.exports={createValidation}