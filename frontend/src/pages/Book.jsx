import { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const API_URL = '/books/'

function Book() {
    const {user} = useContext(UserContext)
    const [ book, setBook ] = useState(null)
    const params = useParams()

    useEffect(() => {
        const fetchBook = async () => {
          try {
            const res = await axios.get(API_URL + params.id)
            if(res.data) {
                setBook(res.data)
            } else {
              console.log('Nem találtam a könyvet.')
            }
          } catch (error) {
            console.log(error)
          }  
        }
        fetchBook()
    }, [params.id])

    const handleClick = () => {

    }

   
    return (

      <div className="container mt-4">
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
        center={[book.geolocation.lat, book.geolocation.lng]} 
        zoom={12} 
        scrollWheelZoom={false}  
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        <Marker position={[book.geolocation.lat, book.geolocation.lng]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      </div>
      </div>
      <div className="column is-full">
        {user._id === book.user ? (
          <Link to={API_URL + book._id + '/edit'} className="button is-fullwidth is-warning">Szerkeszt</Link>
        ) :
          <button onClick={handleClick} className="button is-fullwidth is-success">Felveszem a kapcsolatot a feltöltővel</button>
      }
      </div>
      </div>
        ) : 'Nem találtam a könyvet.'
        }
      </div>
      
    )
}

export default Book
