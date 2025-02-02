const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    first: { type: String, required: true, minlength: 2, maxlength: 255 },
    middle: { type: String, required: true, minlength: 2, maxlength: 255 },
    last: { type: String, required: true, minlength: 2, maxlength: 255 },
  },
  phone: { type: String, minlength: 9, maxlength: 11, required: true },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  address: {
    state: { type: String, minlength: 2, maxlength: 256 },
    country: { type: String, minlength: 2, maxlength: 256 },
    city: { type: String, minlength: 2, maxlength: 256 },
    street: { type: String, minlength: 2, maxlength: 256 },
    houseNumber: { type: String, minlength: 2, maxlength: 256 },
    zip: { type: String, minlength: 2, maxlength: 256 },
  },
  image: {
    url: { type: String, minlength: 6, maxlength: 1024 },
    alt: { type: String, minlength: 6, maxlength: 1024 },
  },
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema, "users");

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(255).required(),
      middle: Joi.string().max(255).allow(""),
      last: Joi.string().min(2).max(255).required(),
    }),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(1024).required(),
    address: Joi.object({
      state: Joi.string().min(2).max(255).required(),
      country: Joi.string().min(2).max(255).required(),
      city: Joi.string().min(2).max(255).required(),
      street: Joi.string().min(2).max(255).required(),
      houseNumber: Joi.string().min(2).max(255).required(),
    }),
    image: {
      url: Joi.string().min(6).max(1024),
      alt: Joi.string().min(6).max(1024),
    },

    isBusiness: Joi.boolean().required(),
  });

  return schema.validate(user);
}

module.exports = { User, validateUser };
