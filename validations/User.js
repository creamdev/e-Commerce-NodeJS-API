const Joi = require('joi');

const createValidation = Joi.object({
    name:Joi.string().min(5).max(20).required(),
    password:Joi.string().min(8).max(15).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email:Joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).messages({
        "any.required": "{{#label}} is required!!",
        "string.empty": "{{#label}} can't be empty!!",
      }),
})

const loginValidation = Joi.object({
    password:Joi.string().min(8).max(15).required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email:Joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).messages({
        "any.required": "{{#label}} is required!!",
        "string.empty": "{{#label}} can't be empty!!",
      })
});

module.exports={createValidation,loginValidation}