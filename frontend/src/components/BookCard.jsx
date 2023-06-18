import { Link } from 'react-router-dom'

function BookCard({ book }) {
    return (
      <div className="column is-one-quarter">
        <Link to={'/books/' + book._id }>
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
      </div>
    )
}

export default BookCard
