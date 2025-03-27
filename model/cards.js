const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
  },
  web: {
    type: String,
    required: true,
    minlength: 14,
  },
  image: {
    url: {
      type: String,
      minlength: 14,
      required: false,
    },
    alt: {
      type: String,
      minlength: 2,
      maxlength: 256,
      required: false,
    },
  },
  address: {
    state: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    street: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    houseNumber: {
      type: Number,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
  },

  bizNumber: {
    type: Number,
    required: true,
    min: 100,
    max: 9_999_999_999,
    unique: true,
  },
  likes: {
    type: Array,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model("Card", cardSchema, "cards");

async function generateBizNumber() {
  while (true) {
    const random = _.random(100, 9_999_999_999);
    const card = await Card.findOne({ bizNumber: random });
    if (!card) {
      return random;
    }
  }
}

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string().min(9).max(11).required(),
    email: Joi.string().min(5).required(),
    web: Joi.string().min(14).required(),
    image: Joi.object({
      url: Joi.string().min(14).optional().allow(""),
      alt: Joi.string().min(2).max(256).optional().allow(""),
    }),
    address: Joi.object({
      state: Joi.string().min(2).max(256).required(),
      country: Joi.string().min(2).max(256).required(),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().required(),
      zip: Joi.number().required(),
    }),
  });
  return schema.validate(card);
}

module.exports = {
  Card,
  generateBizNumber,
  validateCard,
};
