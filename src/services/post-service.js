// import { privateAxios, myAxios } from "./helper";

// // Create post
// export const createPost = (postData, userId, categoryId) => {
//     return privateAxios
//     .post(`/user/${userId}/category/${categoryId}/posts`, postData)
//     .then((response) => response.data);
// };

// // Get all posts with pagination
// export const loadAllPosts = (pageNumber, pageSize) => {
//     return myAxios
//     .get(
//         `/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=addedDate&sortDir=desc`
//     )
//     .then((response) => response.data);
// };

// // Load single post
// export const loadPost = (postId) => {
//     return myAxios.get(`/posts/${postId}`).then((response) => response.data);
// };

// // Create comment
// export const createComment = (comment, postId) => {
//     return privateAxios.post(`/comments/post/${postId}`, comment);
// };

// // Upload post image
// export const uploadPostImage = (image, postId) => {
//     let formData = new FormData();
//     formData.append("image", image);

//     return privateAxios
//     .post(`/posts/image/upload/${postId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//     })
//     .then((response) => response.data);
// };

// // Get category-wise posts
// export const loadAllPostCategoryWise = (categoryId) => {
//     return privateAxios
//     .get(`/category/${categoryId}/posts`)
//     .then((res) => res.data);
// };

// // Get user-wise posts
// export const loadPostUserWise = (userId) => {
//     return privateAxios.get(`/user/${userId}/posts`).then((res) => res.data);
// };

// // Delete post
// export const deletePostService = (postId) => {
//     return privateAxios.delete(`/posts/${postId}`).then((res) => res.data);
// };

// // Update post
// export const updatePost = (post, postId) => {
//     console.log("Updating post:", post);
//     return privateAxios.put(`/posts/${postId}`, post).then((resp) => resp.data);
// };

import { privateAxios, myAxios } from "./helper";

// Create post (needs login)
export const createPost = (postData, userId, categoryId) => {
  return privateAxios
    .post(`/user/${userId}/category/${categoryId}/posts`, postData)
    .then((response) => response.data);
};

// Get all posts
export const loadAllPosts = (pageNumber, pageSize) => {
  return myAxios
    .get(`/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=addedDate&sortDir=desc`)
    .then((response) => response.data);
};

// Get single post
export const loadPost = (postId) => {
  return myAxios.get(`/posts/${postId}`).then((response) => response.data);
};

// Create comment
export const createComment = (comment, postId) => {
  return privateAxios.post(`/comments/post/${postId}`, comment);
};

// Upload image
export const uploadPostImage = (image, postId) => {
  const formData = new FormData();
  formData.append("image", image);
  return privateAxios
    .post(`/posts/image/upload/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => response.data);
};

// Category-wise posts
export const loadAllPostCategoryWise = (categoryId) => {
  return privateAxios.get(`/category/${categoryId}/posts`).then((res) => res.data);
};

// User-wise posts
export const loadPostUserWise = (userId) => {
  return privateAxios.get(`/user/${userId}/posts`).then((res) => res.data);
};

// Delete post
export const deletePostService = (postId) => {
  return privateAxios.delete(`/posts/${postId}`).then((res) => res.data);
};

// Update post
export const updatePost = (post, postId) => {
  return privateAxios.put(`/posts/${postId}`, post).then((resp) => resp.data);
};

// Likes
export const getLikes = async (postId) => {
  try {
    const res = await myAxios.get(`/posts/${postId}/likes`);
    return res.data;
  } catch (e) {
    return 0;
  }
};

export const likePost = (postId) => {
  return privateAxios.post(`/posts/${postId}/likes`).then((res) => res.data);
};

export const unlikePost = (postId) => {
  return privateAxios.delete(`/posts/${postId}/likes`).then((res) => res.data);
};
