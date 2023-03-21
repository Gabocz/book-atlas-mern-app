import { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import BackButton from '../components/BackButton'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const API_URL = '/books/'

function Book() {
    const {user} = useContext(UserContext)
    const [ book, setBook ] = useState(null)
    const [ mapCenter, setMapCenter ] = useState({
      lat: 46.2530102, 
      lng: 20.1414253
    })
    
    const params = useParams()

    useEffect(() => {
        const fetchBook = async () => {
          try {
            const res = await axios.get(API_URL + params.id)
            if(res.data) {
                setBook(res.data)
                setMapCenter(res.data.geolocation)
            } else {
              console.log('Nem találtam a könyvet.')
            }
          } catch (error) {
            console.log(error)
          }  
        }
        fetchBook()
    }, [params.id])

   
    return (

      <div className="column">
        {book ? (
          <div className="columns is-multiline">
            <div className="column is-half">
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
      </div>
      <div className="column is-half">
      <div className="card">
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
      </div>
      { user && (
      <div className="column">
        <div className="field is-grouped">
          <p className="control">
            <BackButton />
          </p>
          <p className="control">
            {user._id === book.user ? (
              <Link to={API_URL + book._id + '/edit'} className="button is-warning">
                <span className="icon"><FaEdit/></span>
                  <span>Szerkeszt</span>
              </Link>
        ) :
          <button className="button is-success">
            Felveszem a kapcsolatot a feltöltővel
          </button>
      }
          </p>
        </div>
      </div>
      ) }

      </div>
            ) : 'Nem találtam a könyvet.'
        }
      </div>
      
    )
}

export default Book
