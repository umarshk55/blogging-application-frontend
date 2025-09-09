import React, { useEffect, useState } from "react";
import Base from '../../components/Base'
import AddPost from "../../components/AddPost"
import { Container } from "reactstrap";
import { getCurrentUserDetail } from "../../auth";
import { deletePostService, loadPostUserWise } from "../../services/post-service";
import { toast } from "react-toastify";
import Post from "../../components/Post";

const Userdashboard = () => {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const currentUser = getCurrentUserDetail();
        console.log(currentUser);
        setUser(currentUser);
        loadPostData()
    }, []);

    function loadPostData(){
        loadPostUserWise(getCurrentUserDetail().id)
            .then(data => {
            console.log(data);
            setPosts([...data]);
        }).catch(error => {
            console.log(error);
            toast.error("Error in loading user posts");
        });
    }

    // function to delete post
    function deletePost(post) {
        console.log(post)
        deletePostService(post.postId)
            .then(res => {
                console.log(res);
                toast.success("Post deleted successfully!");
                let newPosts = posts.filter(p=> p.postId != post.postId)
                setPosts([...newPosts])
                // remove deleted post from UI
                // setPosts(posts.filter(p => p.postId !== post.postId));
            })
            .catch(error => {
                console.log(error);
                toast.error("Error in deleting post");
            });
    }

    return (
        <Base>
            <Container>
                <AddPost />
                <h1 className="my-3">Posts Count : ( {posts.length} )</h1>
                {posts.map((post, index) => (
                    <Post post={post} key={index} deletePost={deletePost} />
                ))}
            </Container>
        </Base>
    );
};

export default Userdashboard;
