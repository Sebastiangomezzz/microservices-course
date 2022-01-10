const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const { type } = require('express/lib/response');
const app = express();

app.use(bodyParser.json());
app.use(cors());//USES CORS TO AVOID CORS ERRORS.

//CREAMOS UN OBJETO DONDE GUARDAR LOS DATOS
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id]) || [];
});

//CREACION DEL COMMENT.
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');

  //RECUPERAMOS EL CONTENIDO DEL POST DEL BODY.
  const { content } = req.body;

  //RECUPERAMOS ARRAY CON LOS OBJETOS 'COMENTARIO' PARA EL ID SOLICITADO EN LA URL.
  const comments = commentsByPostId[req.params.id] || [];

  //INSERTAMOS EL NUEVO OBJETO 'COMENTARIO' EN EL ARRAY.
  //LE AÑADIMOS UN STATUS PARA EL SERVICIO DE MODERACION
  comments.push({ id: commentId, content, status: 'pending' });

  //VOLVEMOS A METER EL ARRAY DE COMENTARIOS EN EL POST CON EL ID INDICADO EN LA URL.
  commentsByPostId[req.params.id] = comments;

  //SE EMITE EL EVENTO Y LOS DATOS HACIA EL BUS DE EVENTOS
  //AÑADIMOS STATUS PARA QUE EL SERVICIO QUERY LO PUEDA PERSISTIR
  await axios
    .post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
    })
    .catch((err) => console.log(err));

  res.status(201).send(comments);
});

//RECIBE EL NUEVO EVENTO DESDE EL BUS DE EVENTOS
app.post('/events', async (req, res) => {
  console.log('Received event from event-bus/comments', req.body.type);

  //DESESTRUCTURAMOS LOS DATOS DEL EVENTO
  const { type, data } = req.body;

  //SI EL EVENTO ES DE TIPO COMMENTMODERATED...
  if (type === 'CommentModerated') {
    //DESESTRUCTURAMOS LOS DATOS QUE NOS INTERESAN DENTRO DE DATA PARA PODER ACTUALIZAR EL STATUS
    const { id, postId, status, content } = data;
    //ENCONTRAMOS EL POST EN CUESTION
    const comments = commentsByPostId[postId];
    //ENCONTRAMOS EL COMMENT DENTRO DEL POST
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    //ACTUALIZAMOS EL STATUS
    comments.status = status;
    //ENVIAMOS UN EVENTO AL BUS INDICANDO QUE EL COMENTARIO HA SIDO ACTUALIZADO Y LOS DATOS ACTUALIZADOS.
    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content,
        },
      })
      .catch((err) => {
        console.error(err);
      });
  }
  res.send({});
});
app.listen(4001, () => {
  console.log('listening on port 4001');
});
