const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]) || [];
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body; //RECUPERAMOS EL CONTENIDO DEL POST DEL BODY

    const comments = commentsByPostId[req.params.id] || []; //RECUPERAMOS ARRAY CON LOS OBJETOS 'COMENTARIO' PARA EL ID SOLICITADO EN LA URL

    comments.push({ id: commentId, content }); //INSERTAMOS EL NUEVO OBJETO 'COMENTARIO' EN EL ARRAY
    
    commentsByPostId[req.params.id] = comments; //VOLVEMOS A METER EL ARRAY DE COMENTARIOS EN EL POST CON EL ID INDICADO EN LA URL

    res.status(201).send(comments);
});


app.listen(4001, () => {
    console.log("listening on port 4001");
});