import axios from 'axios'

export const fetchBook = async (url) => {
    try {
      const res = await axios.get(url)
      return res.data
    } catch (error) {
      console.log(error)
    }  
}

export  const getBookOwner = async (id) => {
    try {
      const res = await axios.get(`/users/${id}`)
      const bookOwner = res.data
      return bookOwner
      } catch(error) {
      console.log(error)
    } 
  }

export const deleteBook = async (url, token) => {
  const config = {
    headers: {
    Authorization: `Bearer ${token}`
      }
    }
    try {
      await axios.delete(url, config)
    } catch (error) {
      console.log(error)
     }
  }
    

  export const addBook = async (url, token, bookData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }    
    try {
      const response = await axios.post(url, bookData, config)
      return response.data 
    } catch (error) {
      console.log(error)
    }
  }


export const fetchBooks = async (url) => {
    try {
      const res = await axios.get(url)
      return {
        books : res.data.books, 
        totalPages: res.data.totalPages}
      } catch (error) {
      console.log(error)
    }
      
  }
