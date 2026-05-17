const express = require("express");
const app = express();
require("dotenv").config();

const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");

app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const DB = process.env.DB;

const corsoptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,PATCH",
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

// Serve frontend build assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsoptions
});

// Make io accessible to our router and controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});