import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import { fetchBooks } from '../helpers/book'


const API_URL = '/books'

function Home({ setIsLoading, isLoading }) {
  const { user } = useContext(UserContext)
  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  const paginate = pageNumber => setCurrentPage(pageNumber);
    
    
  useEffect(() => {
    (async () => {
        setIsLoading(true)
        const data = await fetchBooks(API_URL + "?page=" + currentPage)
        const { books, totalPages } = data
        setBooks(books)
        setTotalPages(totalPages)
        setIsLoading(false)
      })()
    }, [setIsLoading, currentPage])


      if(isLoading) {
        return <Spinner/>
      }
   
  
  return (
      <>
      <div className="columns is-multiline mt-2">  

        {books.length > 0  ? books.map(book => 

       (

      <div className="column is-one-quarter" key={book._id}>
        {user ? (
      <Link to={API_URL + '/' + book._id }>
        <div className="card">
          <div className="card-image">
          <figure className="image is-256x256">
            <img src={book.images[0].url} alt="book"/>
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
            <img src={book.images[0].url} alt="book"/>
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
      <Pagination totalPages={totalPages} paginate={paginate} />
      </>
) 

  }
  
    
    
export default Home
