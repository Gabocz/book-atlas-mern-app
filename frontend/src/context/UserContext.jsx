import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? "/users/"
    : process.env.REACT_APP_API_URL + "/users/";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    fetchUser();
  }, []);

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(API_URL + "register", userData);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const updateUser = async (userData) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("user"));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(API_URL + user.id, userData, config);
      if (response.data) {
        const { id, name, token } = response.data;
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        loggedInUser.name = name;
        loggedInUser.id = id;
        loggedInUser.token = token;
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        setUser(loggedInUser);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const login = async (userData) => {
    try {
      const { data } = await axios.post(API_URL + "login", userData);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
      return data.user;
    } catch (error) {
      console.log(error);
      setUser(null);
      return error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const contextValue = {
    user,
    setUser,
    registerUser,
    updateUser,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
