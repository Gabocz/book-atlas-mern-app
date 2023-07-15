import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Map from '../components/Map'
import ImgCarouselControl from '../components/ImgCarouselControl'
import BackButton from '../components/BackButton'
import { fetchBook, getBookOwner, deleteBook } from '../helpers/book'
import Spinner from '../components/Spinner'
import BookCard from '../components/BookCard'


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
    
    useEffect(() => {
          (async () => {
              setIsLoading(true)
              const book = await fetchBook(params.id)
              if(book) {
              const { user, geolocation } = book
              setBook(book)
              const owner =  await getBookOwner(user)
              setBookOwner(owner)
              setMapCenter(geolocation)
              setIsLoading(false)
              } else {
                setIsLoading(false)
                navigate('/*', {replace: true})
                toast.error('A keresett azonosítóval nem találtam könyvet.')
              }           
          })()
        }, [params.id, setIsLoading, navigate]) 

       
    const handleDelete = async () => {
      setIsLoading(true)
      if(window.confirm('Biztosan törölni szeretnéd ezt a könyvet?')) {
        await deleteBook(params.id, user.token)
        toast.success('Sikeres törlés.')
        setIsLoading(false)
        navigate(`/users/${user.id}`)
        } else {
          setIsLoading(false)
          return
        }
    }
    
    if(isLoading) {
      return <Spinner/>
    }

   
    return (
      <div className="column">
        {(book && bookOwner) && (
          <div className="columns is-multiline">
            <div className="column is-half">
              <BookCard book={book} bookOwner={bookOwner} ImgCarouselControl={ImgCarouselControl}/>
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
                  {user && user.id === book.user ? (
                    <Link to={`/books/${book._id}/edit`} className="button is-warning is-responsive">
                      <span className="icon"><FaEdit/></span>
                        <span>Szerkeszt</span>
                    </Link>
              
                   ) : bookOwner !== null && (
                  <a className="button is-success is-responsive"
                    href={user ? `mailto: ${bookOwner.email}?Subject=${book.author + ': ' + book.title}` : '/login'}
                    >
                      Kapcsolatfelvétel a feltöltővel
                  </a>
                    )}
                </p>
                { user && user.id === book.user && (        
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
