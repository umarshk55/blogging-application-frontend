import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Base from '../components/Base'
import userContext from '../context/userContext'
import { loadPost, updatePost as doUpdatePost, uploadPostImage } from '../services/post-service'
import { loadAllCategories } from '../services/category-service'
import { Card, CardBody, Form, Input, Label, Button, Container } from "reactstrap"
import JoditEditor from "jodit-react"

function UpdateBlog() {
  const editor = useRef(null)
  const { blogId } = useParams()
  const object = useContext(userContext)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [post, setPost] = useState(null)

  useEffect(() => {
    loadAllCategories()
      .then((data) => setCategories(data))
      .catch(() => toast.error("Error loading categories"))

    // load post
    loadPost(blogId)
      .then((data) => {
        setPost({ ...data, categoryId: data.category.categoryId })
      })
      .catch(() => toast.error("Error loading the blog"))
  }, [blogId])

  useEffect(() => {
    if (post) {
      if (post.user.id !== object.user.data.id) {
        toast.error("This is not your post !!")
        navigate("/")
      }
    }
  }, [post, object.user.data.id, navigate])

  const handleChange = (event, fieldName) => {
    setPost({
      ...post,
      [fieldName]: event.target.value,
    })
  }

  const handleFileChange = (event) => {
    setImage(event.target.files[0])
  }

  const updatePost = (event) => {
    event.preventDefault()
    doUpdatePost({ ...post, category: { categoryId: post.categoryId } }, post.postId)
      .then((res) => {
        toast.success("Post updated")

        // upload image if selected
        if (image) {
          uploadPostImage(image, post.postId)
            .then(() => toast.success("Image uploaded"))
            .catch(() => toast.error("Error uploading image"))
        }
      })
      .catch(() => toast.error("Error in updating post"))
  }

  const updateHtml = () => (
    <div className="wrapper">
      <Card className="shadow-sm border-0 mt-2">
        <CardBody>
          <h3>Update post from here !!</h3>
          <Form onSubmit={updatePost}>
            {/* Title */}
            <div className="my-3">
              <Label for="title">Post title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter here"
                className="rounded-0"
                name="title"
                value={post.title}
                onChange={(event) => handleChange(event, 'title')}
              />
            </div>

            {/* Content */}
            <div className="my-3">
              <Label for="content">Post Content</Label>
              <JoditEditor
                ref={editor}
                value={post.content}
                onChange={(newContent) => setPost({ ...post, content: newContent })}
              />
            </div>

            {/* File upload */}
            <div className="mt-3">
              <Label for="image">Select Post banner</Label>
              <Input id="image" type="file" onChange={handleFileChange} />
            </div>

            {/* Category */}
            <div className="my-3">
              <Label for="category">Post Category</Label>
              <Input
                type="select"
                id="category"
                className="rounded-0"
                name="categoryId"
                value={post.categoryId}
                onChange={(event) => handleChange(event, 'categoryId')}
              >
                <option disabled value={0}>--Select category--</option>
                {categories.map((category) => (
                  <option value={category.categoryId} key={category.categoryId}>
                    {category.categoryTitle}
                  </option>
                ))}
              </Input>
            </div>

            <Container className="text-center">
              <Button type="submit" className="rounded-0" color="primary">Update Post</Button>
              <Button type="reset" className="rounded-0 ms-2" color="danger">Reset Content</Button>
            </Container>
          </Form>
        </CardBody>
      </Card>
    </div>
  )

  return (
    <Base>
      <Container>{post && updateHtml()}</Container>
    </Base>
  )
}

export default UpdateBlog
