import { Link } from 'react-router-dom'

const API_URL = '/books/'

function SearchResults({foundBooks}) {
    return (
        <div className="column">
          {foundBooks.length > 0 ? (
             <section className="panel mt-3">
              <h3 className="panel-heading">A keresés eredménye:</h3>
             <ul>
               {foundBooks.map(book => (
                <Link key={book._id} to={API_URL + book._id} className="panel-block">
                  <li>{book.author}: {book.title}</li>
                </Link>
               ))}
             </ul>
            </section>     
          ) : <p>A keresés nem hozott eredményt. Próbáld újra.</p>
               }
        </div>
    )
}

export default SearchResults
