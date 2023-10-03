import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import { fetchBooks } from "../helpers/book";
import { UserContext } from "../context/UserContext";

function Home({ setIsLoading, isLoading }) {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(UserContext);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await fetchBooks(currentPage);
      const { books, totalPages } = data;
      setBooks(books);
      setTotalPages(totalPages);
      setIsLoading(false);
    })();
  }, [setIsLoading, currentPage, user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="columns is-multiline mt-1">
        {books.length ? (
          books.map((book) => (
            <div key={book._id} className="column is-one-quarter">
              <Link to={"/books/" + book._id}>
                <BookCard
                  book={book}
                  wishlistedByUser={
                    user &&
                    book.wishlistedBy.map((user) => user.id).includes(user.id)
                  }
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="column">
            <p className="is-size-5">Még nincsenek feltöltött könyvek.</p>
          </div>
        )}
      </div>
      <Pagination
        totalPages={totalPages}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
}

export default Home;
