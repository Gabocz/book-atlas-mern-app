import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios'

const API_URL = '/users/'

const UserContext = createContext()

const UserContextProvider = ({ children }) => {
  
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = () => {
      setUser(JSON.parse(localStorage.getItem('user')))
    }
      
    fetchUser()
  }, [])

  
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(API_URL + 'register', userData)
  
     if(response.data) {
       localStorage.setItem('user', JSON.stringify(response.data))
       setUser(response.data)
     }
     return response.data
  
  } catch (error) {
    console.log(error)
  }
}

  const updateUser = async (userData) => {
    try {
      const {token} = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
      const response = await axios.put(API_URL + user._id, userData, config)

      if(response.data) {

        const loggedInUser = JSON.parse(localStorage.getItem('user'))
        loggedInUser.email = response.data.email
        loggedInUser.name = response.data.name
        localStorage.setItem('user', JSON.stringify(loggedInUser))
        setUser(loggedInUser)

      }
  
     return response.data
  
  } catch (error) {
    console.log(error)
  }
  }
  
  
  const login = async (userData) => {
    try {
      const response = await axios.post(API_URL + 'login', userData)
      
      if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        setUser(response.data)
      }
      return response.data
      
    } catch(error) {
      console.log(error)
      setUser(null)
    }
  }


  
  const logout = async () => {
    localStorage.removeItem('user')
    setUser(null)
  }
       

        
    const contextValue = useMemo(() => ({
      user,
      registerUser,
      updateUser,
      login, 
      logout
    }), [user, registerUser, login, logout, updateUser])


    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    )
  }
  
  export { UserContext, UserContextProvider};
