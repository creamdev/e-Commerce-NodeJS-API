const Joi = require('joi')

const createValidation = Joi.object({ 
    name:Joi.string().min(3).max(20).required(),
    description:Joi.string().required(),
    price:Joi.string().required(),
    stock:Joi.string().required(),
    image:Joi.string().required,
    brand:Joi.required(),
    category:Joi.required(),  
    }    
)


module.exports={createValidation}