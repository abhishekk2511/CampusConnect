const express = require("express");
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const DB = process.env.DB;

const corsoptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,DELETE",
  credentials: true
};

app.use(cors(corsoptions));

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:");
    console.log(err);
  });

const userroutes = require("./routes/route");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/", userroutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});