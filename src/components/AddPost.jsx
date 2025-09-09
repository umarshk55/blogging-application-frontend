import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  Container,
} from "reactstrap";
import { loadAllCategories } from "../services/category-service";
import JoditEditor from "jodit-react";
import {
  createPost as doCreatePost,
  uploadPostImage,
} from "../services/post-service";
import { getCurrentUserDetail } from "../auth";
import { toast } from "react-toastify";

const AddPost = () => {
  const editor = useRef(null);

  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(undefined);

  const [post, setPost] = useState({
    title: "",
    content: "",
    categoryId: "",
  });

  const [image, setImage] = useState(null);

  // load categories + user
  useEffect(() => {
    setUser(getCurrentUserDetail());

    loadAllCategories()
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // handle input fields
  const fieldChanged = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const contentFieldChanged = (data) => {
    setPost({ ...post, content: data });
  };

  // handle file input
  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  };

  // reset form
  const resetForm = () => {
    setPost({
      title: "",
      content: "",
      categoryId: "",
    });
    setImage(null);
  };

  // create post
  const createPost = (event) => {
    event.preventDefault();

    if (post.title.trim() === "") {
      toast.error("Post title is required !!");
      return;
    }
    if (post.content.trim() === "") {
      toast.error("Post content is required !!");
      return;
    }
    if (post.categoryId === "") {
      toast.error("Select some category !!");
      return;
    }

    // ✅ pass userId + categoryId
    doCreatePost(post, user.id, post.categoryId)
      .then((data) => {
        toast.success("Post Created !!");

        if (image) {
          uploadPostImage(image, data.postId)
            .then(() => {
              toast.success("Image Uploaded !!");
            })
            .catch((error) => {
              toast.error("Error in uploading image");
              console.log(error);
            });
        }

        resetForm();
      })
      .catch((error) => {
        toast.error("Post not created due to some error !!");
        console.log(error);
      });
  };

  return (
    <div className="wrapper">
      <Card className="shadow-sm border-0 mt-2">
        <CardBody>
          <h3>What’s going in your mind?</h3>
          <Form onSubmit={createPost}>
            {/* Title */}
            <div className="my-3">
              <Label for="title">Post Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter here"
                className="rounded-0"
                name="title"
                value={post.title}
                onChange={fieldChanged}
              />
            </div>

            {/* Content */}
            <div className="my-3">
              <Label for="content">Post Content</Label>
              <JoditEditor
                ref={editor}
                value={post.content}
                onChange={(newContent) => contentFieldChanged(newContent)}
              />
            </div>

            {/* Image upload */}
            <div className="mt-3">
              <Label for="image">Select Post Banner</Label>
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
                onChange={fieldChanged}
              >
                <option value="">--Select category--</option>
                {categories.map((category) => (
                  <option value={category.categoryId} key={category.categoryId}>
                    {category.categoryTitle}
                  </option>
                ))}
              </Input>
            </div>

            {/* Buttons */}
            <Container className="text-center">
              <Button type="submit" className="rounded-0" color="primary">
                Create Post
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="rounded-0 ms-2"
                color="danger"
              >
                Reset Content
              </Button>
            </Container>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPost;
