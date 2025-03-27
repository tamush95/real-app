const express = require("express");
const router = express.Router();
const { Card, generateBizNumber, validateCard } = require("../model/cards");
const authMW = require("../middleware/authMW");

router.post("/", authMW, async (req, res) => {
  // Validate the request body
  const { error } = validateCard(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  console.log(error);
  try {
    // Process
    const card = await new Card({
      ...req.body,
      bizImage:
        req.body.bizImage ??
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      user_id: req.user._id,
      bizNumber: await generateBizNumber(),
    }).save();

    // Response
    res.json(card);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// Route to get all cards
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});
// Route to get all cards created by the authenticated user
router.get("/my-cards", authMW, async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.json(cards);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});
// Route to get a specific card by ID
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card not found");
    res.json(card);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});
// Route to edit a card by ID (only by the user who created it)
router.put("/:id", authMW, async (req, res) => {
  // Validate the request body
  const { error } = validateCard(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Find the card by ID
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card not found");

    // Check if the authenticated user is the creator of the card
    if (card.user_id.toString() !== req.user._id) {
      return res
        .status(403)
        .send("Access denied. You are not the creator of this card.");
    }

    // Update the card
    Object.assign(card, req.body);
    await card.save();

    // Response
    res.json(card);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});
// Route to like or unlike a card by ID
router.patch("/:id", authMW, async (req, res) => {
  try {
    // Find the card by ID
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card not found");

    // Check if the user has already liked the card
    const userId = req.user._id;
    const index = card.likes.indexOf(userId);

    if (index === -1) {
      // User has not liked the card, so add their like
      card.likes.push(userId);
    } else {
      // User has already liked the card, so remove their like
      card.likes.splice(index, 1);
    }

    // Save the card
    await card.save();

    // Response
    res.json(card);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});

// Route to delete a card by ID (only by the user who created it or an admin)
router.delete("/:id", authMW, async (req, res) => {
  try {
    // Find the card by ID
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).send("Card not found");

    // Check if the authenticated user is the creator of the card or an admin
    if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
      return res
        .status(403)
        .send("Access denied. You are not authorized to delete this card.");
    }

    // Delete the card
    await card.deleteOne();

    // Response
    res.json(card);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
