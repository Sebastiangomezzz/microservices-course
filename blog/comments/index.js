const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());//USES CORS TO AVOID CORS ERRORS.

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]) || [];
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body; //RECUPERAMOS EL ID DEL POST DEL BODY

  const comments = commentsByPostId[req.params.id] || []; //RECUPERAMOS EL OBJETO CON LOS COMENTARIOS PARA EL ID SOLICITADO EN LA URL

  comments.push({ id: commentId, content }); //INSERTAMOS EL NUEVO COMENTARIO EN EL ARRAY

  commentsByPostId[req.params.id] = comments;

  await axios
    .post("htttp://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
      },
    })
    .catch((err) => {
      console.log(err);
    });

    res.status(201).send(comments);
});

app.post('/events', (req, res) => {
    console.log('Event Received', req.body.type);

    res.send({});
})

app.listen(4001, () => {
    console.log("listening on port 4001");
})