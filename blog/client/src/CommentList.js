import React from "react";
<<<<<<< HEAD
//import axios from "axios";

const CommentList = ({ comments }) => {
  // TODO ESTE BLOQUE SE COMENTA PORQUE YA NO HACE FALTA, AHORA EL SERVICIO QUERY SE ENCARGA DE HACER LAS PETICIONES.

  // const [comments, setComments] = useState([]);

  // const fetchData = async () => {
  //   const res = await axios.get(
  //     `http://localhost:4001/posts/${postId}/comments`
  //   );

  //   setComments(res.data);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  if (Array.isArray(comments)) {
    const renderedComments = comments.map((comment) => {
      return <li key={comment.id}>{comment.content}</li>;
    });

    return <ul>{renderedComments}</ul>;
  }else return <></>
}
=======


const CommentList = ({ comments }) => {
 

  const renderedComments = comments.map((comment) => {
    let content;

    if (comment.status === 'approved') {
      content = comment.content;
    }
    if (comment.status === 'pending') {
      content = 'This comment is waiting for moderation';
    }
    if (comment.status === 'rejected') {
      content = 'This comment has been rejected';
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

>>>>>>> 30b654080f2234c1def3f09006cb49a68b70c49b
export default CommentList;
