const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const router = express.Router();
const { User, validateUser } = require("../model/users");
const authMW = require("../middleware/authMW");

// Route to register a new user
router.post("/", async (req, res) => {
  // Validate user input
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if the email already exists
  let existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).send("User already registered with this email.");
  }

  // Process registration
  let user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);
  await user.save();

  // Response
  res.json(_.pick(user, ["_id", "name", "email"]));
});

// Route to get all users (admin only)
router.get("/", authMW, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).json("User is not an Admin");
    return;
  }
  const users = await User.find();
  res.json(users);
});

// Route to get a user by ID
router.get("/:id", authMW, async (req, res) => {
  // Validate if the user is an admin or the user themselves
  if (!req.user.isAdmin && req.user._id.toString() !== req.params.id) {
    return res.status(403).send("Access denied.");
  }

  // Find the user by ID
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  // Return the user details
  res.json(_.pick(user, ["_id", "name", "email"]));
});

// Route to edit a user's own information
router.put("/me", authMW, async (req, res) => {
  // Find the user by ID (from the authenticated user)
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  // Check if the new email is already taken by another user
  if (req.body.email && req.body.email !== user.email) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("Email already in use.");
    }
  }

  // Update user fields only if they are provided in the request body
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.address) user.address = req.body.address;
  if (req.body.image) user.image = req.body.image;
  if (req.body.isBusiness !== undefined) user.isBusiness = req.body.isBusiness;

  // If the password is provided, hash it and update
  if (req.body.password) {
    user.password = await bcrypt.hash(req.body.password, 12);
  }

  // Save the updated user
  await user.save();

  // Return the updated user details
  res.json(
    _.pick(user, [
      "_id",
      "name",
      "email",
      "phone",
      "address",
      "image",
      "isBusiness",
    ])
  );
});

// Route to toggle the business status of the authenticated user
router.patch("/me/business-status", authMW, async (req, res) => {
  // Find the user by ID (from the authenticated user)
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  // Toggle the isBusiness status
  user.isBusiness = !user.isBusiness;

  // Save the updated user
  await user.save();

  // Return the updated user details
  res.json(_.pick(user, ["_id", "name", "email", "isBusiness"]));
});
// Route to delete a user
router.delete("/:id", authMW, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user; // Assumes user is attached to request in auth middleware

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (
      currentUser._id.toString() !== user._id.toString() &&
      !currentUser.isAdmin
    ) {
      return res.status(403).send("Unauthorized action.");
    }

    await user.deleteOne();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send("Internal server error.");
  }
});

module.exports = router;
