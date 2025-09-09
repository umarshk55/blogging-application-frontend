// import { data, Link, useParams } from "react-router-dom"
// import Base from "../components/Base"
// import { Card, CardBody, CardText, Container, Row, Col, Input, Button } from "reactstrap"
// import { useEffect, useState } from "react"
// import { createComment, loadPost } from "../services/post-service"
// import { toast } from "react-toastify"
// import { BASE_URL } from "../services/helper"
// import { isLoggedIn } from "../auth"


// const PostPage = () => {
//     const { postId } = useParams()
//     const [post, setPost] = useState(null)
//     const [comment,setComment]=useState({
//         content:""
//     })

//     useEffect(() => {
//         // load post of postId
//         loadPost(postId).then(data => {
//             console.log(data)
//             setPost(data)
//         }).catch(error => {
//             console.log(error)
//             toast.error("Error in loading post")
//         })
//     }, [postId])

//     const printDate = (numbers) => {
//         return new Date(numbers).toLocaleString()   // readable format
//     }

//     const SubmitPost=()=>{
//         if(!isLoggedIn()){
//             toast.error("Need to login first !!")
//             return
//         }
//         if(comment.content.trim()===''){
//             return
//         }
//         createComment(comment,post.postId)
//         .then(data=>{
//             console.log(data)
//             toast.success("comment added ..")
//             setPost({
//                 ...post,
//                 comments:[...post.comments,data.data]
//             })
//             setComment({
//                 content:''
//             })
//         }).catch(error=>{
//             console.log(error)
//         })
//     }

//     return (
//         <Base>
//             <Container className="mt-4">
//                 <Link to="/">Home</Link> / {post &&(<Link to="">{post.title}</Link>)}
//                 <Row>
//                     <Col md={{ size: 12 }}>
//                         <Card className="mt-3 ps-2">
//                             {
//                                 post && (
//                                     <CardBody className="mt-3">
//                                         <CardText>
//                                             📌 Posted By <b>{post?.user?.name}</b>  
//                                             {" "}on <b>{printDate(post?.addedDate)}</b>
//                                         </CardText>
//                                         <CardText>
//                                             <span className="text-muted">{post.category.categoryTitle }</span>
//                                         </CardText>
//                                         <div className="divder" style={{
//                                             width:'100%',
//                                             height:'1px',
//                                             background:'#e2e2e2'
//                                         }}>

//                                         </div>
//                                         <h1>{post.title}</h1>
//                                         <div className="image-conatiner mt-5 shadow container text-center" style={{width:'50%'}}>
//                                             <img className="img-fluid" src={BASE_URL+'/post/image/'+post.imageName} alt="" />
//                                         </div>
//                                         <CardText className="mt-5" dangerouslySetInnerHTML={{ __html: post.content }} />
//                                     </CardBody>
//                                 )
//                             }
//                         </Card>
//                     </Col>
//                 </Row>
//                 <Row className="mt-4">
//                     <Col md={{
//                         size:9,
//                         offset:1
//                     }}>
//                         <h3>Comments ({post ? post.comments.length : 0})</h3>
//                         {
//                             post && post.comments.length > 0 ? (
//                                 post.comments.map((c, index) => (
//                                     <Card className="mt-2 border-0 shadow-sm" key={index}>
//                                         <CardBody>
//                                             <b>{c?.user?.name || "Anonymous"}</b>: {c.content}
//                                         </CardBody>
//                                     </Card>
//                                 ))
//                             ) : (
//                                 <p className="text-muted">No comments yet. Be the first to comment!</p>
//                             )
//                         }
//                         <Card className="mt-4 border-0" >
//                             <CardBody>
//                                 <Input
//                                 type="textarea"
//                                 placeholder="Enter comment here"
//                                 value={comment.content}
//                                 onChange={(event) => setComment({content:event.target.value})}
//                                 />
//                                 <Button onClick={SubmitPost} className="mt-2" color="primary">Submit</Button>
//                             </CardBody>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Container>
//         </Base>
//     )
// }

// export default PostPage

import { Link, useParams } from "react-router-dom";
import Base from "../components/Base";
import { Card, CardBody, CardText, Container, Row, Col, Input, Button } from "reactstrap";
import { useEffect, useState } from "react";
import { createComment, loadPost, getLikes, likePost, unlikePost } from "../services/post-service";
import { toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import { isLoggedIn } from "../auth";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState({ content: "" });
  const [likes, setLikes] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);

  useEffect(() => {
    loadPost(postId)
      .then(data => {
        setPost(data);
      })
      .catch(() => toast.error("Error in loading post"));

    // Try to get likes from backend; if not available, ignore errors
    getLikes(postId)
      .then((n) => setLikes(typeof n === "number" ? n : n?.count ?? 0))
      .catch(() => {});
  }, [postId]);

  const printDate = (numbers) => new Date(numbers).toLocaleString();

  const submitComment = () => {
    if (!isLoggedIn()) {
      toast.error("Need to login first !!");
      return;
    }
    if (comment.content.trim() === "") return;

    createComment(comment, post.postId)
      .then((data) => {
        toast.success("Comment added");
        setPost((prev) => ({
          ...prev,
          comments: [...(prev?.comments || []), data.data ?? data],
        }));
        setComment({ content: "" });
      })
      .catch(() => toast.error("Error adding comment"));
  };

  const toggleLike = async () => {
    if (!isLoggedIn()) {
      toast.error("Login to like");
      return;
    }
    try {
      if (likedByMe) {
        await unlikePost(postId);
        setLikes((n) => Math.max(0, n - 1));
        setLikedByMe(false);
      } else {
        await likePost(postId);
        setLikes((n) => n + 1);
        setLikedByMe(true);
      }
    } catch {
      // If backend not ready, do optimistic UI
      setLikedByMe((v) => !v);
      setLikes((n) => (likedByMe ? Math.max(0, n - 1) : n + 1));
    }
  };

  return (
    <Base>
      <Container className="mt-4">
        <Link to="/">Home</Link> / {post && <Link to="">{post.title}</Link>}
        <Row>
          <Col md={{ size: 12 }}>
            <Card className="mt-3 ps-2">
              {post && (
                <CardBody className="mt-3">
                  <CardText>
                    📌 Posted By <b>{post?.user?.name}</b> on <b>{printDate(post?.addedDate)}</b>
                  </CardText>
                  <CardText>
                    <span className="text-muted">{post.category.categoryTitle}</span>
                  </CardText>
                  <div className="divder" style={{ width: '100%', height: 1, background: '#e2e2e2' }} />
                  <div className="d-flex align-items-center justify-content-between">
                    <h1 className="mb-0">{post.title}</h1>
                    <Button onClick={toggleLike} color={likedByMe ? "danger" : "outline-danger"}>
                      {likedByMe ? "♥" : "♡"} {likes}
                    </Button>
                  </div>

                  <div className="image-conatiner mt-5 shadow container text-center" style={{ width: '50%' }}>
                    <img className="img-fluid" src={BASE_URL + '/post/image/' + post.imageName} alt="" />
                  </div>

                  <CardText className="mt-5" dangerouslySetInnerHTML={{ __html: post.content }} />
                </CardBody>
              )}
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={{ size: 9, offset: 1 }}>
            <h3>Comments ({post ? post.comments.length : 0})</h3>
            {post && post.comments.length > 0 ? (
              post.comments.map((c, index) => (
                <Card className="mt-2 border-0 shadow-sm" key={index}>
                  <CardBody>
                    <b>{c?.user?.name || "Anonymous"}</b>: {c.content}
                  </CardBody>
                </Card>
              ))
            ) : (
              <p className="text-muted">No comments yet. Be the first to comment!</p>
            )}

            <Card className="mt-4 border-0">
              <CardBody>
                <Input
                  type="textarea"
                  placeholder="Enter comment here"
                  value={comment.content}
                  onChange={(e) => setComment({ content: e.target.value })}
                />
                <Button onClick={submitComment} className="mt-2" color="primary">Submit</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Base>
  );
};

export default PostPage;
