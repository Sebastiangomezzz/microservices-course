const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

//FOR THIS TOY PROJECT, WE WILL BE STORING LOCALLY, SO WHEN WE SHUT DOWN THE PROJECT WE WILL LOSE ALL THE DATA.

const app = express();
app.use(bodyParser.json()); //PARSES THE CONTENT OF THE BODY TO JSON FORMAT.
app.use(cors()); //USES CORS TO AVOID CORS ERRORS.

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex"); //THIS LINE GENERATES A RANDOM ID OF 4 BYTES IN HEXADECIMAL
  const title = req.body.title; //OR const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {//ESTE OBJETO SERÁ EMITIDO PARA TODA LA APLICACIÓN A TRAVES DEL BUS DE EVENTOS
      type: "PostCreated",
      data: {
        id,
        title,
      },
    })
    .catch((err) => console.log(err));

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
})

app.listen(4000, () => {
  console.log("listening on 4000");
});
