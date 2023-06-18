import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { toast } from 'react-toastify'
import BackButton from '../components/BackButton'
import ImgCarouselControls from '../components/ImgCarouselControls'
import { fetchBook, getBookOwner, deleteBook } from '../helpers/book'
import Spinner from '../components/Spinner'


function Book({isLoading, setIsLoading}) {
    const {user} = useContext(UserContext)
    const [ book, setBook ] = useState(null)
    const [ images, setImages ] = useState([])
    const [ currentImgIdx, setCurrentImgIdx ] = useState(0)
    const [ bookOwner, setBookOwner ] = useState(null)
    const [ mapCenter, setMapCenter ] = useState({
      lat: 46.2530102, 
      lng: 20.1414253
    })

    const navigate = useNavigate()
    const params = useParams()
    
    useEffect(() => {
          (async () => {
            setIsLoading(true)
            const book = await fetchBook(params.id)
            if(book) {
              const { images, user, geolocation } = book
              setBook(book)
              setImages(images)
              const owner =  await getBookOwner(user)
              setBookOwner(owner)
              setMapCenter(geolocation)
              setIsLoading(false)
            } 
          })()
        }, [params.id, setIsLoading]) 
        
       
    const handleDelete = async () => {
      setIsLoading(true)
      if(window.confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
        await deleteBook(params.id, user.token)
        toast.success('Sikeres törlés.')
        setIsLoading(false)
        navigate(`/users/${user.id}`)
        } else {
          setIsLoading(false)
          return
        }
    }
    
    if(isLoading) {
      return <Spinner/>
    }
   
    return (
      <div className="column">
        {book && bookOwner ? (
          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="card">
                <div className="card-image">
                  <figure className="image is-256x256">
                    <img src={images[currentImgIdx].url} alt="book"/>
                  </figure>
              {images.length > 1 && (
                <ImgCarouselControls 
                  currentImgIdx={currentImgIdx}
                  setCurrentImgIdx={setCurrentImgIdx}
                  numOfImgs={images.length}
                />
              )}
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{book.title}</p>
                      <p className="subtitle is-6">{book.author}</p>
                    </div>
                  </div>
                  <div className="content">
                    <p>{book.location}</p>
                    <p>Feltöltő: {bookOwner.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-half">
              <MapContainer
                style={{height: "450px", width: "100%"}} 
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={12} 
                scrollWheelZoom={false}  
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={[mapCenter.lat, mapCenter.lng]}>
                      <Popup>
                        {book.author}: <br /> {book.title}
                      </Popup>
                    </Marker>
              </MapContainer>
            </div>
            <div className="column">
              <div className="field is-grouped">
                <p className="control">
                  <BackButton />
                </p>
                <p className="control">
                  { user && user._id === book.user ? (
                    <Link to={`/books/${book._id}/edit`} className="button is-warning is-responsive">
                      <span className="icon"><FaEdit/></span>
                        <span>Szerkeszt</span>
                    </Link>
              
                   ) : bookOwner !== null && (
                  <a className="button is-success is-responsive"
                    href={user ? `mailto: ${bookOwner.email}?Subject=${book.author + ': ' + book.title}` : '/login'}
                  >
                    Kapcsolatfelvétel a feltöltővel
                  </a>
                    )
                  }
                </p>
                { user && user._id === book.user && (        
                <p className="control">
                  <button onClick={handleDelete} className="button is-outlined is-danger is-responsive">
                    Törlés
                  </button>
                </p>
          )}
              </div>
            </div>
          </div>
            ) : <p>'Nem találtam a könyvet.'</p>
        }
      </div>
    )
}

export default Book
