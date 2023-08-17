import axios from 'axios'

const API_URL = 'https://quantumbook.onrender.com/users/'

export const getUserById = async (id) => {
  try {
    const res = await axios.get(API_URL + id)
    const foundUser = res.data
    return foundUser
  } catch (err) {
    console.log(err)
  }
}
