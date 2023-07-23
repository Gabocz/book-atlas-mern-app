import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

function BookCard({ book, ImgCarouselControl, bookOwner}) {

  const {user} = useContext(UserContext)

  const [ currentImgIdx, setCurrentImgIdx ] = useState(0)
  
  const { author, title, images, location } = book
  
  return (
      <div className="card">
      <div className="card-image">
        <figure className="image is-256x256">
          <img src={images && images[currentImgIdx].url} alt="book"/>
        </figure>
        {ImgCarouselControl && images.length > 1 && (
        <ImgCarouselControl 
          currentImgIdx={currentImgIdx}
          setCurrentImgIdx={setCurrentImgIdx}
          numOfImgs={images.length}
        />
        )}
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="title is-size-4-desktop is-size-5-tablet is-size-6-mobile" >{title}</p>
            <p className="subtitle is-6">{author}</p>
          </div>
        </div>
        <div className="content">
          <p className='is-size-6-desktop is-size-7-tablet is-size-7-mobile'>{location}</p>
          {bookOwner && <p className='is-size-6-desktop is-size-7-tablet is-size-7-mobile'>Feltöltő: 
          {user && user.id ===book.user ? <strong> Én</strong> : (
            user ? <Link to={`/users/${bookOwner._id}`}> {bookOwner.name}</Link>
            : <strong> {bookOwner.name}</strong>
            )}
            </p>}
        </div>
      </div>
    </div>
    )
}

export default BookCard
