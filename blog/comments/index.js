const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id]) || [];
});

//CREACION DEL COMMENT
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');

  //RECUPERAMOS EL CONTENIDO DEL POST DEL BODY
  const { content } = req.body;

  //RECUPERAMOS ARRAY CON LOS OBJETOS 'COMENTARIO' PARA EL ID SOLICITADO EN LA URL
  const comments = commentsByPostId[req.params.id] || [];

  //INSERTAMOS EL NUEVO OBJETO 'COMENTARIO' EN EL ARRAY
  comments.push({ id: commentId, content });

  //VOLVEMOS A METER EL ARRAY DE COMENTARIOS EN EL POST CON EL ID INDICADO EN LA URL
  commentsByPostId[req.params.id] = comments;

  //SE EMITE EL EVENTO Y LOS DATOS HACIA EL BUS DE EVENTOS
  await axios
    .post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
      },
    })
    .catch((err) => console.log(err));

  res.status(201).send(comments);
});

//RECIBE EL NUEVO EVENTO DESDE EL BUS DE EVENTOS
app.post('/events', (req, res) => {
    console.log('Received event from event-bus/comments', req.body.type);
    res.send({});
})
app.listen(4001, () => {
  console.log('listening on port 4001');
});
