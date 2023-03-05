import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'


const API_URL = '/books'

function Home() {
  const { user } = useContext(UserContext)
  const [ books, setBooks ] = useState([])

    
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(API_URL)
        if(res.data) {
          setBooks(res.data)
        } else {
          console.log('Nem találtam könyveket.')
        } 
      } catch (error) {
         console.log(error)
      }
        
    }
  fetchBooks()
  }, [])

   
  
        return ( 
   <div className="columns is-multiline mt-2">  

  {books.length > 0  ? books.map(book => 

  (

<div className="column is-one-quarter" key={book._id}>
      {user ? (
    <Link to={API_URL + '/' + book._id }>
      <div className="card">
        <div className="card-image">
          <figure className="image is-256x256">
            <img src={book.imgs[0]} alt="book"/>
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
              <div className="media-content">
              <p className="title is-4">{book.title}</p>
              <p className="subtitle is-6">{book.author}</p>
            </div>
          </div>
          <div className="content">
            {book.location}
          </div>
        </div>
      </div>
    </Link>
      ) :  (
      <div className="card">
        <div className="card-image">
          <figure className="image is-256x256">
            <img src={book.imgs[0]} alt="book"/>
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <p className="title is-4">{book.title}</p>
              <p className="subtitle is-6">{book.author}</p>
            </div>
          </div>
          <div className="content">
            {book.location}
          </div>
          </div>
        </div>
      )}
</div>
  )) 
    : 'Nem találtam könyveket.'

}
  </div> 
) 

  }
  
    
    
export default Home
