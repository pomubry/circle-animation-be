const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes imports
const register = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");
const comboUpdate = require("./routes/comboUpdate");
const beatmaps = require("./routes/beatmaps");
const beatmapsEasy = require("./routes/beatmapsEasy");
const beatmapsNormal = require("./routes/beatmapsNormal");
const beatmapsHard = require("./routes/beatmapsHard");

// config
dotenv.config();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: process.env.ORIGIN,
  credentials: true,
};

// middlewares
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

// routes
app.use("/api/beatmaps", beatmaps);
app.use("/api/beatmaps/easy", beatmapsEasy);
app.use("/api/beatmaps/normal", beatmapsNormal);
app.use("/api/beatmaps/hard", beatmapsHard);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/logout", logout);
app.use("/api/combo-update", comboUpdate);

// connect to db
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to the database!");
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
});
