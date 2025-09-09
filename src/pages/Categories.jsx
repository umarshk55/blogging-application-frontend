import React, { useEffect, useState } from 'react'
import Base from '../components/Base'
import { useParams } from 'react-router-dom'
import { Container, Row, Col } from "reactstrap";
import CategorySideMenu from "../components/CategorySideMenu";
import { loadAllPostCategoryWise } from '../services/post-service';
import { toast } from 'react-toastify';
import Post from '../components/Post';
import { deletePostService } from '../services/post-service';
function Categories() {
    const [posts, setPosts] = useState([]);
    const { categoryId } = useParams();

    useEffect(() => {
        console.log("CategoryId:", categoryId);
        loadAllPostCategoryWise(categoryId)
            .then(data => {
                setPosts([...data]);
            })
            .catch(error => {
                console.error(error);
                toast.error("Error in loading posts");
            });
    }, [categoryId]);

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
            <Container className="mt-3">
                <Row>
                    <Col md={2} className="pt-5">
                        <CategorySideMenu />
                    </Col>
                    <Col md={10}>
                        <h1>Blogs Counts ( {posts.length} )</h1>
                        {
                            posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <Post deletePost={deletePost} key={index} post={post} />
                                ))
                            ) : (
                                <h3 className="text-center mt-5">No posts found in this category.</h3>
                            )
                        }
                    </Col>
                </Row>
            </Container>
        </Base>
    )
}

export default Categories;
