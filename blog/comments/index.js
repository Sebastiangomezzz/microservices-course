const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]) || [];
});

app.post('/posts/:id/comments', (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body; //RECUPERAMOS EL ID DEL POST DEL BODY

    const comments = commentsByPostId[req.params.id] || []; //RECUPERAMOS EL OBJETO CON LOS COMENTARIOS PARA EL ID SOLICITADO EN LA URL

    comments.push({ id: commentId, content }); //INSERTAMOS EL NUEVO COMENTARIO EN EL ARRAY
    
    commentsByPostId[req.params.id] = comments; 

    res.status(201).send(comments);
});


app.listen(4001, () => {
    console.log("listening on port 4001");
})