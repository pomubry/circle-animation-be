const Joi = require('joi');

const updateValidate = Joi.object({
  code: Joi.string().required(),
  difficulty: Joi.number().required(),
  highestCombo: Joi.number().min(0).max(1200).integer().required(),
});

module.exports = updateValidate;
