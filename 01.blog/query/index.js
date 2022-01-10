const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//CREAMOS UN OBJETO DONDE GUARDAR LOS DATOS QUE NOS VAN A LLEGAR DESDE EL BUS DE EVENTOS O QUE VAMOS A ENVIAR CUANDO NOS LOS PIDAN.
const posts = {};

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    //DESESTRUCTURAMOS LOS DATOS DEL POST.
    const { id, title } = data;

    //LOS METEMOS EN EL OBJETO 'POSTS' QUE HEMOS CREADO ARRIBA, CREANDO UNA 'KEY' CON EL VALOR DE ID Y ASIGNANDOLE A ESA KEY UN OBJETO CON 'ID' Y 'TITLE', DEJANDO UN DEFAULT DE 'COMMENTS' CON UN ARRAY VACIO.
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    //DESESTRUCTURAMOS LOS DATOS DEL COMMENT, INCLUIMOS STATUS
    const { id, content, postId, status } = data;

    //LOCALIZAMOS EL POST CON EL ID QUE NOS LLEGA.
    const post = posts[postId];

    //LE METEMOS EL 'COMMENT' AL POST PERTINENTE.
    post.comments.push({
      id,
      content,
      status, //PERSISTIMOS EL STATUS TAMBIEN
    });
  }

  if (type === 'CommentUpdated') {
    //EXTRAEMOS LOS DATOS DEL COMMENT DESDE DATA;
    const { id, content, postId, status } = data;

    //LOCALIZAMOS EL POST CON EL ID QUE NOS LLEGA.
    const post = posts[postId];
    //ENCONTRAMOS EL COMMENT DENTRO DEL POST
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    // ACTUALIZAMOS EL STATUS Y EL CONTENT.
    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  //CUANDO ALGUIEN ACCEDA A ESTE ENDPOINT LE ENVIAMOS TODOS LOS POSTS.
  res.send(posts);
});

//VIENE DESDE EL BUS DE EVENTOS.
app.post('/events', (req, res) => {
  //LO QUE NOS LLEGA A TRAVES DEL BODY ES EL EVENTO CON SU TYPE Y DATA.
  const { type, data } = req.body;
  //EXTRAEMOS TODA LA LOGICA DE MANEJO DE EVENTOS Y LA METEMOS EN UNA HELPER FUNCTION LLAMADA HANDLEVENT, SITUADA MAS ARRIBA.

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('listening on port 4002');
  //METEMOS ESTA LOGICA AQUI PORQUE QUEREMOS QUE SE EJECUTE CADA VEZ QUE EL SERVICIO PASE DE ESTAR DESCONECTADO A ESTAR EN LINEA.
  //VA A PEDIR AL BUS DE EVENTOS LA LISTA DE EVENTOS QUE HAN SUCEDIDO.
  const res = await axios.get('http://localhost:4005/events').catch((err) => {
    console.log(err);
  });
  //PARA CADA EVENTO RECIBIDO VAMOS A MANEJARLO CON EL HANDLEEVENT.
  for (let event of res.data) {
    console.log('processing event', event.type);
    handleEvent(event.type, event.data);
  }
});
