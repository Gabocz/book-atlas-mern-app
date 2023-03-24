import { useState, useEffect, useContext } from 'react'
import { FaUpload, FaSave } from "react-icons/fa"
import BackButton from '../components/BackButton'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { UserContext } from '../context/UserContext'
import Spinner from '../components/Spinner'


function EditBook() {
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()

  const API_URL = `/books/${params.id}`

    const [ book, setBook ] = useState(false)

    useEffect(() => {
      setIsLoading(true)
      const fetchBook = async () => {
        try {
          const res = await axios.get(API_URL)
          if(res.data) {
              setBook(res.data)
              setFormData({
                author: res.data.author,
                title: res.data.title,
                location: res.data.location,
                lang: res.data.lang,
              })
              setIsLoading(false)
            } else {
            console.log('Nem találtam a könyvet.')
          }
        } catch (error) {
          console.log(error)
        }  
      }
      fetchBook()
  }, [params.id, API_URL])

    const [formData, setFormData] = useState({
        author: book.author,
        title: book.title,
        location: book.location,
        lang: book.lang,
        imgs: ''
    })
    
    const { author, title, location, lang, imgs } = formData

    const {user} = useContext(UserContext)
    
    const navigate = useNavigate()
    

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
        setIsLoading(true)
        await updateBook(formData).then(data => {
          if(data) {
            navigate('/')
            toast.success('Sikeres módosítás', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
            setIsLoading(false)
          } else {
            toast.error('Nem sikerült módosítani. Próbáld újra.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
          }
        }
        )  
    }

    
    const updateBook = async(bookData) => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const coords = await getGeoLocation()
      const updatedBook = {...bookData, geolocation: coords}
      const response = await axios.put(API_URL, updatedBook, config)
      
      return response.data
      
    }

    if(isLoading) {
      return <Spinner/>
    }


   if(!book) {
    return <p>Nem találtam a könyvet.</p>
   }

    return (
        <div className="column">
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
                    <span className="icon"><FaSave/></span>
                    <span>Mentés</span>
                  </button>
                </div>
            </div>
            </form>
        </section>
        </div>
    )
}

export default EditBook
