import axios from "axios";

const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? "/users/"
    : process.env.REACT_APP_API_URL + "/users/";

export const getUserById = async (userId) => {
  try {
    const res = await axios.get(API_URL + userId);
    const foundUser = res.data;
    return foundUser;
  } catch (err) {
    console.log(err);
  }
};

export const addBookToWishlist = async (userId, token, bookId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.post(API_URL + userId, { bookId: bookId }, config);
    return res.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
