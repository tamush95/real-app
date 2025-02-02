const express = require("express");
const Joi = require("joi");
const { User } = require("../model/users");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { JWTKey } = require("../config/config");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("invalid email");
    return;
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("invalid password");
    return;
  }
  const token = JWT.sign(
    {
      _id: user._id,
      isBusiness: user.isBusiness,
      isAdmin: user.isAdmin,
    },
    JWTKey
  );

  res.status(201).send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).email().required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(user);
}

module.exports = router;
