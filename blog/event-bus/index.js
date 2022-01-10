const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', function (req, res) {
    const event = req.body;

    axios.post('htttp://localhost:4000/events', event).catch((err) => {
        console.log(err);
    });
     axios.post("htttp://localhost:4001/events", event).catch((err) => {
       console.log(err);
     });
     axios.post("htttp://localhost:4002/events", event).catch((err) => {
       console.log(err);
     });
     res.send({status: 'OK'});
})


app.listen(4005, () => {
    console.log('listening on port 4005')
})