const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => { //PIDE LA INFO A LA RUTA POSTS.
    res.send(posts);
});

app.post('/events', (req, res) => { //SIRVE LA INFO A LA RUTA EVENTS, DONDE ESTA EL BUS.
    const { type, data } = req.body; //CADA EVENTO QUE RECIBIMOS TIENE UN TIPO Y UNOS DATOS.
    
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };// SI ES DE TIPO POST CREAMOS UN POST DENTRO DEL OBJETO POSTS.
        console.log(posts);
    }
    
    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        const post = posts[postId];
        console.log(postId);
        console.log(posts);
        post.comments.push({ id, content }); //SI ES DE TIPO COMMENTS CREAMOS UN OBJETO COMMENT DENTRO DEL ARRAY COMMENTS.
        
    }
    
    res.send({});//IMPORTANTE PONER ESTO SIEMPRE DESPUES DE UN ROUTE HANDLER.
});

app.listen(4002, () => {
    console.log('listening on port 4002');
});