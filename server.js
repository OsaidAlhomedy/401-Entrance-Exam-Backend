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
      email: "roaa.abualeeqa@gmail.com",
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

//http://localhost:3010/test
server.get("/test", (req, res) => {
  res.send("hello testing");
});

//http://localhost:3010/getFlowers
server.get("/getFlowers", getFlowersHandle);

async function getFlowersHandle(req, res) {
  await axios
    .get("https://flowers-api-13.herokuapp.com/getFlowers")
    .then((result) => {
      res.status(200).send(result.data.flowerslist);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

//http://localhost:3010/addFlower
server.post("/addFlower", addFlowerHandle);

async function addFlowerHandle(req, res) {
  const { email, name, img, description } = req.body;
  await userModel.findOne({ email: email }, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      result.favArr.push({ name: name, img: img, description: description });
      result.save();
      res.status(201).send("updated");
    }
  });
}

//http://localhost:3010/getFavFlowers
server.get("/getFavFlowers", favFlowerHandle);

async function favFlowerHandle(req, res) {
  const email = req.query.email;
  await userModel.findOne({ email: email }, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      res.status(200).send(result.favArr);
    }
  });
}

//http://localhost:3010/deleteFavFlowers/id
server.delete("/deleteFavFlowers/:id", deleteFlowerHandle);

async function deleteFlowerHandle(req, res) {
  const email = req.query.email;
  const id = req.params.id;
  await userModel.findOne({ email: email }, (err, result) => {
    if (err) res.send(err);
    if (result) {
      const newArr = result.favArr.filter((item) =>
        item._id == id ? false : true
      );
      result.favArr = newArr;
      result.save();
      res.send(result.favArr);
    }
  });
}

//http://localhost:3010/updateFavFlowers/id
server.put("/updateFavFlowers/:id", updateFlowerHandle);

async function updateFlowerHandle(req, res) {
  const id = req.params.id;
  const { email, name, img, description } = req.body;

  await userModel.findOne({ email: email }, (err, result) => {
    if (err) res.send(err);
    if (result) {
      const newArr = result.favArr.map((item) => {
        if (item._id == id) {
          item = {
            name: name,
            img: img,
            description: description,
          };
          return item;
        } else {
          return item;
        }
      });
      result.favArr = newArr;
      result.save();
      res.send(result.favArr);
    }
  });
}

server.listen(PORT, () => {
  console.log(`listening on port : ${PORT}`);
});
