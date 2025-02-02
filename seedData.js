const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("./model/users");
const { Card, generateBizNumber } = require("./model/cards");

async function seedData() {
  // Check if the database is empty
  const usersCount = await User.countDocuments();
  const cardsCount = await Card.countDocuments();

  if (usersCount === 0 && cardsCount === 0) {
    console.log("Seeding database...");

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("1234567", salt);

    const adminUser = new User({
      name: { first: "Admin", middle: "yoheved", last: "User" },
      phone: "0555555555",
      email: "admin@example.com",
      password: hashedPassword,
      address: {
        state: "New York",
        country: "USA",
        city: "NYC",
        street: "Broadway",
        houseNumber: "77",
      },
      image: {
        url: "www.stamhirtut.co.il/yo/yoyo",
        alt: "Admin User",
      },
      isBusiness: true,
      isAdmin: true,
    });

    const businessUser = new User({
      name: { first: "Business", middle: "yoyo", last: "User" },
      phone: "0555555555",
      email: "business@example.com",
      password: hashedPassword,
      address: {
        state: "New York",
        country: "USA",
        city: "NYC",
        street: "Broadway",
        houseNumber: "77",
      },
      image: {
        url: "www.stamhirtut.co.il/yo/yoyo",
        alt: "Business User",
      },
      isBusiness: true,
      isAdmin: false,
    });

    const regularUser = new User({
      name: { first: "Regular", middle: "yooo", last: "User" },
      phone: "0555555555",
      email: "regular@example.com",
      password: hashedPassword,
      address: {
        state: "New York",
        country: "USA",
        city: "NYC",
        street: "Broadway",
        houseNumber: "77",
      },
      image: {
        url: "www.stamhirtut.co.il/yo/yoyo",
        alt: "Regular User",
      },
      isBusiness: false,
      isAdmin: false,
    });

    await adminUser.save();
    await businessUser.save();
    await regularUser.save();

    // Create cards
    const card1 = new Card({
      title: "Card 1",
      subtitle: "Subtitle 1",
      description: "Description 1",
      Phone: "0545646464",
      email: "card1@example.com",
      web: "http://example.com/",
      Image: {
        url: "http://example.com/image1.jpg",
        alt: "Card 1 Image",
      },
      address: {
        state: "California",
        country: "USA",
        city: "Tel Aviv",
        street: "Rothschild",
        houseNumber: 12,
        zip: 12345,
      },
      user_id: businessUser._id,
      bizNumber: await generateBizNumber(),
    });

    const card2 = new Card({
      title: "Card 2",
      subtitle: "Subtitle 2",
      description: "Description 2",
      Phone: "0545646464",
      email: "card2@example.com",
      web: "http://example.com/",
      Image: {
        url: "http://example.com/image2.jpg",
        alt: "Card 2 Image",
      },
      address: {
        state: "California",
        country: "USA",
        city: "Tel Aviv",
        street: "Rothschild",
        houseNumber: 12,
        zip: 12345,
      },
      user_id: businessUser._id,
      bizNumber: await generateBizNumber(),
    });

    const card3 = new Card({
      title: "Card 3",
      subtitle: "Subtitle 3",
      description: "Description 3",
      Phone: "0545646464",
      email: "card3@example.com",
      web: "http://example.com/",
      Image: {
        url: "http://example.com/image3.jpg",
        alt: "Card 3 Image",
      },
      address: {
        state: "California",
        country: "USA",
        city: "Tel Aviv",
        street: "Rothschild",
        houseNumber: 12,
        zip: 12345,
      },
      user_id: businessUser._id,
      bizNumber: await generateBizNumber(),
    });

    await card1.save();
    await card2.save();
    await card3.save();

    console.log("Database seeded successfully.");
  } else {
    console.log("Database already contains data. Skipping seeding.");
  }
}

module.exports = seedData;
