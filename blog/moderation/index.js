const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  //DESESTRUCTURAMOS LOS DATOS
  const { type, data } = req.body;
  //SI EL EVENTO ES DE TIPO COMMENT
  if (type === 'CommentCreated') {
    //VEMOS SI EL COMENTARIO CONTIENE LA PALABRA PROHIBIDA Y CAMBIAMOS EL STATUS EN CONSECUENCIA
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    //EMITIMOS UN NUEVO EVENTO CON EL STATUS CAMBIADO
    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status: status,
          content: data.content,
        },
      })
      .catch((err) => {
        console.log(err);
      });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('listening on port 4003');
});
