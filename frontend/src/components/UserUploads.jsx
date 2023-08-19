import { Link } from 'react-router-dom'


function UserUploads({usersBooks}) {
    return (
        <section className="panel mt-3">
              <h3 className="panel-heading is-size-5-mobile">Feltöltések:</h3>
              {usersBooks.length > 0 ? (
                <ul>
                  {usersBooks.map(book => (
                    <Link key={book._id} to={'/books/' + book._id} className="panel-block">
                      <p className='is-size-7-mobile'>{book.author}: {book.title}</p>
                    </Link>
                  ))}
                </ul>
                ) : <p className="is-size-6-mobile">Még nincsenek feltöltött könyvek.</p>
              }
            </section>
    )
}

export default UserUploads
