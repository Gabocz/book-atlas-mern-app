import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import axios from 'axios'

const API_URL = '/books/'

function Profile() {

    const {user} = useContext(UserContext)
    const { updateUser } = useContext(UserContext)

    const [formData, setFormData] = useState({
        name: user.name, 
        email: user.email
    })

    const { name, email } = formData

    const [ changeDetails, setChangeDetails ] = useState(false)
    const [ usersBooks, setUsersBooks ] = useState([])

    useEffect(() => {
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
        await updateUser(formData).then(data => { 
          if(data) {
            toast.success('Sikeresen módosítottad az adataidat.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
            setChangeDetails(false)
          } else {
            toast.error('Nem sikerült módosítani az adataid. Próbáld újra.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
          })
        }
    })
  }

    return (
        <div className='container mt-6'>
        <header className='block'>
            <h1 className="title">Profilom</h1>
            <h2 className='subtitle'>Adataim</h2>
        </header>
        <main>
            <div className="block">
                <button className="button" onClick={() => {
                    changeDetails && onSubmit()
                    setChangeDetails((prevState) => !prevState)
                }}>
                    {changeDetails ? 'Mentés' : 'Szerkeszt'}
                </button>
            </div>
            <section className='block'>
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
          </section>
            <section className='block'>
              <h1 className='is-size-4 my-3'>Feltöltéseim</h1>
          {usersBooks.length > 0 ? (
             <ul>
               {usersBooks.map(book => (
                <Link key={book._id} to={API_URL + book._id}>
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
