// auth.js

// Save user data (with token)
export const doLogin = (data, next) => {
  const payload = data.data ? data.data : data;
  localStorage.setItem("data", JSON.stringify(data));
  next();
};

// Logout
export const doLogout = (next) => {
  localStorage.removeItem("data");
  next();
};

// Check login
export const isLoggedIn = () => {
  let data = localStorage.getItem("data");
  return data != null;
};

// Get user
export const getCurrentUserDetail = () => {
  if (isLoggedIn()) {
    return JSON.parse(localStorage.getItem("data")).user;
  } else {
    return undefined;
  }
};

// auth.js
export const getToken = () => {
  if (!isLoggedIn()) return null;

  const raw = JSON.parse(localStorage.getItem("data"));

  if (!raw) return null;

  // Case 1: token at root
  if (raw.token) return raw.token;

  // Case 2: token nested under data
  if (raw.data?.token) return raw.data.token;

  return null;
};


