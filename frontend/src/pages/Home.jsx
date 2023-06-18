import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import { fetchBooks } from '../helpers/book'


function Home({ setIsLoading, isLoading }) {
  const [books, setBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


  const paginate = pageNumber => setCurrentPage(pageNumber);
    
    
  useEffect(() => {
    (async () => {
        setIsLoading(true)
        const data = await fetchBooks(currentPage)
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
        {books.length ? books.map(book => (
          <BookCard key={book._id} book={book} />
        )): (
          <p>Nem találtam könyveket.</p>
        )}  
      </div> 
      <Pagination totalPages={totalPages} paginate={paginate} />
    </>
 
  )}
    
export default Home
