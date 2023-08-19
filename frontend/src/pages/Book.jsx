import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Map from '../components/Map'
import ImgCarouselControl from '../components/ImgCarouselControl'
import BackButton from '../components/BackButton'
import { fetchBook, deleteBook } from '../helpers/book'
import Spinner from '../components/Spinner'
import BookCard from '../components/BookCard'
import { axiosError } from '../helpers/axiosError'



function Book({isLoading, setIsLoading}) {
    const {user} = useContext(UserContext)
    const [ book, setBook ] = useState(null)
    const [ mapCenter, setMapCenter ] = useState({
      lat: 46.2530102, 
      lng: 20.1414253
    })

    const navigate = useNavigate()
    const params = useParams()
    
    useEffect(() => {
          (async () => {
              setIsLoading(true)
              await fetchBook(params.id).then(res => {

                if(axiosError(res)) {
                  setIsLoading(false)
                  navigate('/*', {replace: true})
                  return
                }

                setBook(res)
                const { geolocation } = res
                setMapCenter(geolocation)
                setIsLoading(false)
              })       
          })()
        }, [params.id, setIsLoading, navigate]) 

       
    const handleDelete = async () => {
      setIsLoading(true)
      if(window.confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
        await deleteBook(params.id, user.token).then(res => {
          if(axiosError(res)) {
            setIsLoading(false)
            toast.error(res.errorMessage)
            return
          }
          toast.success('Sikeres törlés.')
          setIsLoading(false)
          navigate(`/users/my-profile`)
        })
      } 
    }
    
    if(isLoading) {
      return <Spinner/>
    }

   
    return (
      <div className="column">
        {(book && book.user) && (
          <div className="columns is-multiline">
            <div className="column is-half">
              <BookCard book={book} bookOwner={book.user} ImgCarouselControl={ImgCarouselControl}/>
            </div>
            <div className="column is-half">
              <Map mapCenter={mapCenter} author={book.author} title={book.title}/>
            </div>
            <div className="column">
              <div className="field is-grouped">
                <p className="control">
                  <BackButton />
                </p>
                <p className="control">
                  {user && user.id === book.user._id ? (
                    <Link to={`/books/${book._id}/edit`} className="button is-warning is-responsive">
                      <span className="icon"><FaEdit/></span>
                        <span>Szerkeszt</span>
                    </Link>
              
                   ) : book.user !== null && (
                  <a className="button is-success is-responsive"
                    href={user ? `mailto: ${book.user.email}?Subject=${book.author + ': ' + book.title}` : '/login'}
                    >
                      Kapcsolatfelvétel
                  </a>
                    )}
                </p>
                { user && user.id === book.user._id && (        
                <p className="control">
                  <button onClick={handleDelete} className="button is-outlined is-danger is-responsive">
                    Törlés
                  </button>
                </p>
          )}
              </div>
            </div>
          </div>
            ) 
        }
      </div>
    )
}

export default Book
