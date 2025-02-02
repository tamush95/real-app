require("dotenv").config();
const PORT = 3005;

const mongoose = require("mongoose");
const express = require("express");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");
const seedData = require("./seedData");

// +
const app = express();

app.use(require("morgan")("dev"));
app.use(express.json());

app.use("/api/cards", cardsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
// app.use("/api/cards", cardsRouter);

connect();

async function connect() {
  try {
    await mongoose.connect(
      (atlas_connection =
        "mongodb+srv://tamironen95:tamironen95@cluster0.thfrj.mongodb.net/DB?retryWrites=true&w=majority&appName=Cluster0")
    );

    console.log("connected to db");
    seedData();
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  } catch (e) {
    console.log(e.message);
    return;
  }
}
