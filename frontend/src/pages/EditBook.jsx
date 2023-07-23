import { useState, useEffect, useContext } from 'react'
import { FaSave } from "react-icons/fa"
import FileUploader from '../components/FileUploader'
import ButtonGroup from '../components/ButtonGroup'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import Spinner from '../components/Spinner'
import { fetchBook, updateBook } from '../helpers/book'


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
  
        await updateBook(params.id, token, bookData).then(data => {
          if(data) {
            navigate('/')
            toast.success('Sikeres módosítás')
            setIsLoading(false)
          } else {
            toast.error('Nem sikerült módosítani. Próbáld újra.')
            setIsLoading(false)
          }
        })  
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
                <FileUploader handleChange={handleChange} fileList={fileList}/>
              ) : ( 
                <div className='columns mt-2' >
                  {images.map(img => (
                    <div key={img._id} className='column is-one-quarter'>
                      <figure className="image is-256x256">
                        <img src={img.url} alt='book'/>
                      </figure>
                    </div>
                  ))}
                </div>
              )}
              <ButtonGroup canSubmit={canSubmit} btnText='Mentés' icon={<FaSave/>}/>           
            </form>
        </section>
        </div>
    )
}

export default EditBook
