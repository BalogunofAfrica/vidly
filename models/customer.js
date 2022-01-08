const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 20 },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true, minlength: 10, maxlength: 12 },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(20),
    isGold: Joi.boolean(),
    phone: Joi.string().required().min(10).max(12),
  });

  return schema.validate(customer);
}

module.exports = { Customer, validateCustomer };
