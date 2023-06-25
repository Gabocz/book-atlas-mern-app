import { useState } from 'react'


function BookCard({ book, ImgCarouselControl, bookOwner}) {

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
            <p className="title is-4">{title}</p>
            <p className="subtitle is-6">{author}</p>
          </div>
        </div>
        <div className="content">
          <p>{location}</p>
          {bookOwner && <p>Feltöltő: {bookOwner.name}</p>}
        </div>
      </div>
    </div>
    )
}

export default BookCard
