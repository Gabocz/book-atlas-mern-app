import { useState, useContext } from 'react'
import { FaUpload, FaCheck } from "react-icons/fa"
import BackButton from '../components/BackButton'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import Spinner from '../components/Spinner'


function NewBook({ setIsLoading, isLoading }) {
  
  const [fileList, setFileList] = useState(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [lang, setLang] = useState('')
 
  const files = fileList ? [...fileList] : [];



  const {user} = useContext(UserContext)
    
  const navigate = useNavigate()
    
  const API_URL = '/books/'
  
  let geolocation = {}

  const handleChange = (e) => {
    if (e.target.files.length > 3 ) {
      setCanSubmit(false)
      return toast.error('Legfeljebb 3 képet tölthetsz fel.', {
        position: toast.POSITION.BOTTOM_RIGHT, 
        theme: 'dark'
      })
    } else {
      setCanSubmit(true)
      setFileList(e.target.files)
    }
  }
  
    
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
  
    const onSubmit = async (e) => {
      e.preventDefault()
       setIsLoading(true)
        await addBook().then(data => {
          if(data) {
            navigate('/')
            toast.success('Sikeres feltöltés', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
            setIsLoading(false)
          } else {
            toast.error('Nem sikerült a feltöltés. Próbáld újra.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
          }
        }
        )  
    }

    
  const addBook = async () => {
      const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const coords = await getGeoLocation()
    
    const bookData = new FormData()
   
    files.forEach((file, i) => {
      bookData.append("image", file, file.name);
    })
    bookData.append("author", author)
    bookData.append("title", title)
    bookData.append("location", location)
    bookData.append("lang", lang) 
    bookData.append("coords", JSON.stringify(coords))
      
    const response = await axios.post(API_URL, bookData, config)
    
    return response.data
      
  }
  

    if(isLoading) {
      return <Spinner/>
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
            <form onSubmit={onSubmit} encType='multipart/form-data'>
              <div className="field">
                <label id="author" className="label">Szerző</label>
                <div className="control">
                  <input 
                    onChange={(e) => setAuthor(e.target.value)}
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
                    onChange={(e) => setTitle(e.target.value)}
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
                    onChange={(e) => setLang(e.target.value)}
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
                    onChange={(e) => setLocation(e.target.value)}
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
              <div className="file has-name is-info">
                <label id="image" className="file-label">
                <input
                  onChange={handleChange}
                  id="image"
                  name="image"
                  className="file-input" 
                  type="file"
                  multiple
                />
                <span className="file-cta">
                    <span className="file-icon">
                    <FaUpload/>
                    </span>
                    <span className="file-label">
                      Képet töltök fel
                    </span>
                </span>
                {/* <span className="file-name">
                  {files[0] ? files[0].name : ''}
               </span> */}
                </label>
              </div>
              <div className="field is-grouped mt-3">
                <div className="control">
                  <BackButton/>
                </div>
                <div className="control">
                <button type="submit" className="button has-background-info has-text-light" disabled={!canSubmit}>
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
