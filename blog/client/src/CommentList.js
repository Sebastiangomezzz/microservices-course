import React from "react";
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
export default CommentList;
