const Joi = require('joi');


const createValidation= Joi.object({
    name:Joi.string().min(3).max(20).required()
})
const updateValidation= Joi.object({
    name:Joi.string().min(3).max(20).required()
})

module.exports={createValidation,updateValidation}