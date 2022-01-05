const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
//FOR THIS TOY PROJECT, WE WILL BE STORING LOCALLY, SO WHEN WE SHUT DOWN THE PROJECT WE WILL LOSE ALL THE DATA.

const app = express();
app.use(bodyParser.json()); //PARSES THE CONTENT OF THE BODY TO JSON FORMAT.
app.use(cors());

//CREAMOS UN OBJETO DONDE GUARDAR LOS DATOS
const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

//CREACION DEL POST
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex'); //THIS LINE GENERATES A RANDOM ID OF 4 BYTES IN HEXADECIMAL
  const title = req.body.title; //OR const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
    
  //SE EMITE EL EVENTO Y LOS DATOS HACIA EL BUS DE EVENTOS
  await axios
    .post('http://localhost:4005/events', {
      type: 'PostCreated',
      data: {
        id,
        title,
      },
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(201).send(posts[id]);
});

//RECIBE EL NUEVO EVENTO DESDE EL BUS DE EVENTOS
app.post('/events', (req, res) => {
    console.log('Received event from event-bus/posts', req.body.type);
    res.send({});
})

app.listen(4000, () => {
    console.log('listening on 4000');
});
