// import { myAxios, privateAxios } from "./helper";

// // Register
// export const signUp = (user) => {
//     return myAxios.post("/auth/register", user).then(res => res.data);
// };

// // Login
// export const loginUser = (loginDetail) => {
//     return myAxios.post("/auth/login", loginDetail).then(res => res.data);
// };

// // Get user by ID
// export const getUser = (userId) => {
//     return privateAxios.get(`/users/${userId}`).then(res => res.data);
// };

// // Update user info
// export const updateUser = (userId, userData) => {
//     return privateAxios.put(`/users/${userId}`, userData)
//         .then(res => res.data)
//         .catch(error => { throw error });
// };


import { myAxios, privateAxios } from "./helper";

// Register
export const signUp = (user) => {
  return myAxios.post("/auth/register", user).then(res => res.data);
};

// Login
export const loginUser = (loginDetail) => {
  return myAxios.post("/auth/login", loginDetail).then(res => res.data);
};

// Get user by ID
export const getUser = (userId) => {
  return privateAxios.get(`/users/${userId}`).then(res => res.data);
};

// Update user info
export const updateUser = (userId, userData) => {
  return privateAxios.put(`/users/${userId}`, userData).then(res => res.data);
};

// Upload profile image  (backend endpoint suggestion: POST /users/image/upload/{userId})
export const uploadProfileImage = (userId, file) => {
  const formData = new FormData();
  formData.append("image", file);
  return privateAxios.post(`/users/image/upload/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(res => res.data);
};
