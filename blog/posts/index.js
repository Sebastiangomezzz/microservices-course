const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

//FOR THIS TOY PROJECT, WE WILL BE STORING LOCALLY, SO WHEN WE SHUT DOWN THE PROJECT WE WILL LOSE ALL THE DATA. 

const app = express();
app.use(bodyParser.json());//PARSES THE CONTENT OF THE BODY TO JSON FORMAT.

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex'); //THIS LINE GENERATES A RANDOM ID OF 4 BYTES IN HEXADECIMAL 
    const  title = req.body.title; //OR const { title } = req.body;
    posts[id] = {
        id, title
    };
    res.status(201).send(posts[id]);
});

app.listen(4000, () => {
    console.log('listening on 4000')
})