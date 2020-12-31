const Joi = require('joi');

const registerJoiSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = registerJoiSchema;
