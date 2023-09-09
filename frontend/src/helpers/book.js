import axios from "axios";

const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? "/books/"
    : process.env.REACT_APP_API_URL + "/books/";

export const fetchBook = async (id) => {
  try {
    const { data: book } = await axios.get(API_URL + id);
    return book;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteBook = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    await axios.delete(API_URL + id, config);
    return "Sikeres törlés.";
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const addBook = async (token, bookData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.post(API_URL, bookData, config);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateBook = async (id, token, bookData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(API_URL + id, bookData, config);
  return res.data;
};

export const fetchBooks = async (currentPage) => {
  try {
    const res = await axios.get(API_URL + "?page=" + currentPage);
    return {
      books: res.data.books,
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    console.log(error);
  }
};

export const fetchMyBooks = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const res = await axios.get(API_URL + "user/" + id, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const searchBooks = async (searchTerm) => {
  try {
    const res = await axios.get(API_URL + `search/?query=${searchTerm}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
