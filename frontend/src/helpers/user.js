import axios from "axios";

const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? "/users/"
    : process.env.REACT_APP_API_URL + "/users/";

export const getUserById = async (id) => {
  try {
    const res = await axios.get(API_URL + id);
    const foundUser = res.data;
    return foundUser;
  } catch (err) {
    console.log(err);
  }
};
