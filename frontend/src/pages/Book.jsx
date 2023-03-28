import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { toast } from 'react-toastify'
import BackButton from '../components/BackButton'
import axios from 'axios'
import Spinner from '../components/Spinner'

const API_URL = '/books/'

function Book({isLoading, setIsLoading}) {
    const {user} = useContext(UserContext)
    const [ book, setBook ] = useState(null)
    const [ bookOwner, setBookOwner ] = useState(null)
    const [ mapCenter, setMapCenter ] = useState({
      lat: 46.2530102, 
      lng: 20.1414253
    })

    const navigate = useNavigate()
    const params = useParams()

    const getBookOwner = async (id) => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`)
        if(res.data) {
          setBookOwner(res.data)
        }
      } catch(e) {
        console.log(e)
      }
       
    }

    useEffect(() => {
        setIsLoading(true)
        const fetchBook = async () => {
          try {
            const res = await axios.get(API_URL + params.id)
            if(res.data) {
                setBook(res.data)
                getBookOwner(res.data.user)
                setMapCenter(res.data.geolocation)
                setIsLoading(false)
            } else {
              toast.error('Nem találtam a könyvet.')
            }
          } catch (error) {
            console.log(error)
          }  
        }
        fetchBook()
    }, [params.id, setIsLoading])


  const deleteBook = async () => {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      if(window.confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
        await axios.delete(API_URL + params.id, config)
      }
      toast.success('Sikeres törlés.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark'
      })
      setIsLoading(false)
      navigate('/')
    }



    if(isLoading) {
      return <Spinner/>
    }
   
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
        ) : bookOwner !== null && (
          <a className="button is-success"
          href={`mailto: ${bookOwner.email}?Subject=${book.author + ': ' + book.title}`}
          >
            Felveszem a kapcsolatot a feltöltővel
          </a>
        )
      }
          </p>
          <p className="control">
            <button onClick={deleteBook} className="button is-outlined is-danger">
              Törlés
            </button>
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
