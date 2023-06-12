import { useState, useEffect, useContext } from 'react'
import { FaUpload, FaSave, FaTrashAlt, FaEdit } from "react-icons/fa"
import BackButton from '../components/BackButton'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import Spinner from '../components/Spinner'
import { fetchBook, updateBook } from '../helpers/book'
import { getGeoLocation } from '../helpers/geolocation'



function EditBook({isLoading, setIsLoading}) {
  const params = useParams()
  const [ book, setBook ] = useState(false)
  const [fileList, setFileList] = useState(null)
  const [canSubmit, setCanSubmit] = useState(true)
  const [formData, setFormData] = useState({
      author: '',
      title: '',
      location: '',
      lang: '',
      images: []
  }) 
  const { author, title, location, lang, images } = formData
  const {user} = useContext(UserContext)
  const {token} = user
  const navigate = useNavigate()
  const files = fileList ? [...fileList] : [];



  useEffect(() => {
    (async () => {
      setIsLoading(true) 
      const book = await fetchBook(params.id)
      if(book) {
        setBook(book)
        const { author, title, location, lang, images } = book
        setFormData({
          author,
          title,
          location,
          lang, 
          images
      })
        setIsLoading(false)
      }
    })()
  }, [params.id, setIsLoading])
  
    const handleChange = (e) => {
      if (e.target.files.length > 3 ) {
        setCanSubmit(false)
        return toast.error('Legfeljebb 3 képet tölthetsz fel.')
      } else {
        setCanSubmit(true)
        setFileList(e.target.files)
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
        const coords = await getGeoLocation(location)
        const bookData = new FormData()
        if(files) {
          files.forEach((file, i) => {
          bookData.append("image", file, file.name);
          })
        } else {
          bookData.append('images', images)
        }
        bookData.append("author", author)
        bookData.append("title", title)
        bookData.append("location", location)
        bookData.append("lang", lang) 
        bookData.append("coords", JSON.stringify(coords))

        await updateBook(params.id, token, bookData).then(data => {
          if(data) {
            navigate('/')
            toast.success('Sikeres módosítás')
            setIsLoading(false)
          } else {
            toast.error('Nem sikerült módosítani. Próbáld újra.')
          }
        }
        )  
    }

    const handleClick = () => {
      if(window.confirm('Tényleg törölni szeretnéd ezt a képet?')) {
        console.log('Kép törölve')
      }
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
            <form onSubmit={onSubmit} encType='multipart/form-data'>
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
              { !images.length || images[0].filename === 'default' ? (
                <div className="file is-info has-name">
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
              ) : ( 
                <div className='columns mt-2' >
                  {images.map(img => (
                    <div key={img._id} className='column is-one-fifth'>
                      <figure className="image is-256x256">
                        <img src={img.url} alt='book'/>
                        <div className='field is-grouped is-flex is-justify-content-space-between'>
                          <p className='control'>
                            <button className='button is-danger is-outlined is-small is-responsive mt-3' onClick={handleClick}>
                              <span className='icon'><FaTrashAlt/></span>
                              <span>Töröl</span>
                            </button>
                            </p>
                          <p className='control'>
                            <button className='button is-info is-outlined is-small is-responsive mt-3'>
                              <span className='icon'><FaEdit/></span>
                              <span>Szerkeszt</span>
                            </button>
                          </p>
                        </div>
                      </figure>
                    </div>
                  ))}
                </div>
              )}
              <div className="field is-grouped mt-2">
                <div className="control">
                  <BackButton/>
                </div>
                <div className="control">
                  <button type="submit" className="button has-background-info has-text-light is-responsive" disabled={!canSubmit}>
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
