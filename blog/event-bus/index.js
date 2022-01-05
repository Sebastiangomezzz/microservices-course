const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

//EMITE EVENTOS A CADA SERVICIO CADA VEZ QUE HAY UN EVENTO NUEVO EN ALGUNO DE ELLOS
app.post('/events', (req, res) => {
  const event = req.body;
  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err);
  });
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err);
  });
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err);
  });
  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('listening on port 4005');
});
