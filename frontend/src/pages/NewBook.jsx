import { useState, useContext } from 'react'
import { FaUpload, FaCheck } from "react-icons/fa"
import BackButton from '../components/BackButton'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { UserContext } from '../context/UserContext'


function NewBook() {
  const [formData, setFormData] = useState({
      author: '',
      title: '',
      location: '',
      lang: '',
      imgs: ''
  })
  
  const { author, title, location, lang, imgs } = formData
    
    const {user} = useContext(UserContext)
    
    const navigate = useNavigate()
    
    const API_URL = '/books/'

    let geolocation = {}
    
    const getGeoLocation = async () => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
        const data = await response.json()

        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

        return geolocation

      } catch (e) {
        console.log(e)
      }
    }
    
    
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState, 
            [e.target.name] : e.target.value
        }))
    }
    
    const onSubmit = async (e) => {
        e.preventDefault()
        await addBook(formData).then(data => {
          if(data) {
            navigate('/')
            toast.success('Sikeres feltöltés', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
          } else {
            toast.error('Nem sikerült a feltöltés. Próbáld újra.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
          }
        }

        )  
    }

    
    const addBook = async(bookData) => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const coords = await getGeoLocation()
      const newBook = {coords, ...bookData}
      const response = await axios.post(API_URL, newBook, config)
      
      return response.data
      
    }

    return (
        <div className="column">
        <section className="hero has-background-info is-small block">
            <div className='hero-body'>
               <p className='title has-text-light'>
                   Tölts fel új könyvet!
                </p> 
            </div>  
        </section>
        <section className="form">
            <form onSubmit={onSubmit} encType='mulmultipart/form-data'>
              <div className="field">
                <label id="author" className="label">Szerző</label>
                <div className="control">
                  <input 
                    onChange={onChange}
                    id="author"
                    name="author"
                    value={author}
                    className="input" 
                    type="text" 
                    placeholder="Szerző"
                    required
                   />
                </div>
              </div>
              <div className="field">
                <label id="title" className="label">Cím</label>
                <div className="control">
                  <input 
                    onChange={onChange}
                    id="title"
                    name="title"
                    value={title}
                    className="input" 
                    type="text" 
                    placeholder="Cím"
                    required
                   />
                </div>
              </div>
              <div className="field">
                <label id="lang" className="label">Nyelv</label>
                <div className="control">
                  <input 
                    onChange={onChange}
                    id="lang"
                    name="lang"
                    value={lang}
                    className="input" 
                    type="text" 
                    placeholder="Nyelv"
                  />
                </div>
              </div>
              <div className="field">
                <label id="location" className="label">Város, utca, házszám</label>
                <div className="control">
                  <input 
                    onChange={onChange}
                    id="location"
                    name="location"
                    value={location}
                    className="input" 
                    type="text" 
                    placeholder="Város"
                    required
                  />
                </div>
              </div>
              <div className="file is-info">
                <label id="imgs" className="file-label">
                <input
                  onChange={onChange}
                  id="imgs"
                  name="imgs"
                  value={imgs}
                  className="file-input" 
                  type="file" 
                />
                <span className="file-cta">
                    <span className="file-icon">
                    <FaUpload/>
                    </span>
                    <span className="file-label">
                      Képet töltök fel
                    </span>
                </span>
                </label>
              </div>
              <div className="field is-grouped mt-3">
                <div className="control">
                  <BackButton/>
                </div>
                <div className="control">
                  <button type="submit" className="button has-background-info has-text-light">
                    <span className="icon"><FaCheck/></span>
                      <span>Feltöltöm</span>
                  </button>
                </div>
            </div>
            </form>
        </section>
        </div>
    )
}

export default NewBook
