import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaUserEdit, FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import axios from 'axios'
import Spinner from '../components/Spinner'

const API_URL = '/books/'

function Profile() {

    const {user} = useContext(UserContext)
    const { updateUser } = useContext(UserContext)

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name, 
        email: user.email
    })

    const { name, email } = formData

    const [ changeDetails, setChangeDetails ] = useState(false)
    const [ usersBooks, setUsersBooks ] = useState([])

    useEffect(() => {
      setIsLoading(true)
      const fetchUsersBooks = async () => {
        try {
          const {token} = JSON.parse(localStorage.getItem('user'))
        const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
      }
          const res = await axios.get(API_URL +'user/' + user._id, config)
          if(res.data) {
            setUsersBooks(res.data)
            setIsLoading(false)
          }
        } catch(error) {
          console.log(error)
        }
      }
      fetchUsersBooks()
      // eslint-disable-next-line
    }, [user._id])

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id] : e.target.value,
    })) 
    }


    const onSubmit = async () => {
      setIsLoading(true)
        await updateUser(formData).then(data => { 
          if(data) {
            toast.success('Sikeresen módosítottad az adataidat.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
            setChangeDetails(false)
            setIsLoading(false)
          } else {
            toast.error('Nem sikerült módosítani az adataid. Próbáld újra.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
          })
        }
    })
  }
  if(isLoading) {
    return <Spinner/>
  }


    return (
        <div className="column">
        <header className="message">
          <div className="message-header">
            <p>Profilom</p>
            </div>
        </header>
        <main>
             <section className="media">
              <div className="media-content">
              <div className="field">
                <div className="control">
                  <button className="button" onClick={() => {
                    changeDetails && onSubmit()
                    setChangeDetails((prevState) => !prevState)
                }}>
                    {changeDetails ? (
                    <>
                    <span className="icon"><FaSave/></span>
                    <span>Mentés</span>
                    </>
                    )
                     : (
                      <>
                    <span className="icon"><FaUserEdit/></span>
                    <span>Szerkeszt</span>
                    </>
                     )
                     }
                  </button>
                </div>
              </div>
              
          <form onSubmit={onSubmit}>
            <div className="field">
                <label id="name" className="label">Név</label>
                  <div className="control has-icons-left">
                    <input
                      id="name"
                      name="name"
                      value={name}
                      onChange={onChange}
                      className="input" 
                      type="text"
                      disabled={!changeDetails} 
                    />
                    <span className="icon is-small is-left">
                      <FaUser/>
                    </span>
                  </div>
            </div>
            <div className="field">
                <label id="email" className="label">Email</label>
                  <div className="control has-icons-left">
                    <input
                      id="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      className="input" 
                      type="email"
                      disabled={!changeDetails}
                    />
                    <span className="icon is-small is-left">
                      <FaEnvelope/>
                    </span>
                  </div>
            </div>
            </form>
            </div>
            </section>
            <section className="panel mt-3">
              <h3 className="panel-heading">Feltöltéseim</h3>
          {usersBooks.length > 0 ? (
             <ul>
               {usersBooks.map(book => (
                <Link key={book._id} to={API_URL + book._id} className="panel-block">
                  <li>{book.author}: {book.title}</li>
                </Link>
               ))}
             </ul>
          ) : <p>Még nem töltöttél fel könyvet.</p>
            }
            </section>      
        </main>
    </div> 
    )
}

export default Profile
