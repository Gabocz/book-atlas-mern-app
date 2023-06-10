import { useState, useContext } from 'react'
import { FaUpload, FaCheck } from "react-icons/fa"
import BackButton from '../components/BackButton'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addBook } from '../helpers/book'
import { getGeoLocation } from '../helpers/geolocation'
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
  const {token} = user
    
  const navigate = useNavigate()
    
  const API_URL = '/books/'
  

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
  
    const onSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      const coords = await getGeoLocation(location)
      const bookData = new FormData()
   
      files.forEach((file, i) => {
        bookData.append("image", file, file.name);
        })

      bookData.append("author", author)
      bookData.append("title", title)
      bookData.append("location", location)
      bookData.append("lang", lang) 
      bookData.append("coords", JSON.stringify(coords))
      await addBook(API_URL, token, bookData).then(data => {
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
      

   if(isLoading) {
      return <Spinner/>
    }

    return (
      <div className="column">
        <header className="block px-2 py-2">
          <h1 className="title is-3">
                   Tölts fel új könyvet!
          </h1>   
        </header>
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
              <div className="file has-name">
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
                  <span className="file-name">
                    {fileList && fileList.length ? fileList.length : 0} fájl kiválasztva
                  </span>
                </label>
              </div>
              <div className="field is-grouped mt-4">
                <div className="control">
                  <BackButton/>
                </div>
                <div className="control">
                  <button type="submit" className="button is-primary is-outlined is-responsive" disabled={!canSubmit}>
                    <span className="icon">
                      <FaCheck/>
                    </span>
                    <span>
                      Feltöltöm
                    </span>
                   </button>
                </div>
              </div>
            </form>
        </section>
      </div>
    )
}

export default NewBook
