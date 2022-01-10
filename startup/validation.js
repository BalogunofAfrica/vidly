const Joi = require("joi");

module.exports = function () {
  // @ts-ignore
  Joi.objectId = require("joi-objectid")(Joi);
};
