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
    return err;
  }
};

export const getCurrentUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "my-profile", config);
    const foundUser = res.data;
    return foundUser;
  } catch (err) {
    console.log(err);
    return err;
  }
};
