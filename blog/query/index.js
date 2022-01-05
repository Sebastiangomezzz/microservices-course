const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

//CREAMOS UN OBJETO DONDE GUARDAR LOS DATOS QUE NOS VAN A LLEGAR DESDE EL BUS DE EVENTOS O QUE VAMOS A ENVIAR CUANDO NOS LOS PIDAN.
const posts = {};

app.get('/posts', (req, res) => {
    //CUANDO ALGUIEN ACCEDA A ESTE ENDPOINT LE ENVIAMOS TODOS LOS POSTS.
    res.send(posts);
});

//VIENE DESDE EL BUS DE EVENTOS.
app.post('/events', (req, res) => {
  //LO QUE NOS LLEGA A TRAVES DEL BODY ES EL EVENTO CON SU TYPE Y DATA.
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    //DESESTRUCTURAMOS LOS DATOS DEL POST.
    const { id, title } = data;

    //LOS METEMOS EN EL OBJETO 'POSTS' QUE HEMOS CREADO ARRIBA, CREANDO UNA 'KEY' CON EL VALOR DE ID Y ASIGNANDOLE A ESA KEY UN OBJETO CON 'ID' Y 'TITLE', DEJANDO UN DEFAULT DE 'COMMENTS' CON UN ARRAY VACIO.
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    //DESESTRUCTURAMOS LOS DATOS DEL COMMENT.
      const { id, content, postId } = data;

    //LOCALIZAMOS EL POST CON EL ID QUE NOS LLEGA.
    const post = posts[postId];

    //LE METEMOS EL 'COMMENT' AL POST PERTINENTE.
    post.comments.push({
      id,
      content,
    });
  }
    
    console.log(posts)
    
    res.send({});
});

app.listen(4002, () => {
  console.log('listening on port 4002');
});
