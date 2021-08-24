const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());

server.use(express.json());

const PORT = process.env.PORT || 3010;

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const flowerSchmea = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
});

const userSchmea = new mongoose.Schema({
  email: { type: String, unique: true },
  favArr: [flowerSchmea],
});

const userModel = mongoose.model("user", userSchmea);

seedFunction = () => {
  const arrOfUsers = [
    {
      email: "r.abualigah@ltuc.com",
      favArr: [
        {
          name: "testingName",
          img: "https://images.unsplash.com/photo-1501686962565-1350ab98237f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGluayUyMGZsb3dlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
          description: "testing Desc",
        },
      ],
    },
    {
      email: "osaid720720@gmail.com",
      favArr: [
        {
          name: "testingName",
          img: "https://images.unsplash.com/photo-1501686962565-1350ab98237f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGluayUyMGZsb3dlcnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
          description: "testing Desc",
        },
      ],
    },
  ];

  userModel.create(arrOfUsers);
};

// seedFunction();

server.get("/test", (req, res) => {
  res.send("hello testing");
});

server.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
