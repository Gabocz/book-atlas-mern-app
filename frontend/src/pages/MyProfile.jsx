import { useState, useEffect, useContext } from 'react'
import { FaUser, FaEnvelope, FaUserEdit, FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import { fetchMyBooks } from '../helpers/book'
import Spinner from '../components/Spinner'
import UserUploads from '../components/UserUploads'
import BackButton from '../components/BackButton'

function Profile({ setIsLoading, isLoading }) {

    const {user} = useContext(UserContext)
    const { updateUser } = useContext(UserContext)
    const { token, id, } = user

    const [formData, setFormData] = useState({
        name: user.name, 
        email: user.email
    })

    const { name, email } = formData

    const [ changeDetails, setChangeDetails ] = useState(false)
    const [ usersBooks, setUsersBooks ] = useState([])

    useEffect(() => {
      (async () => {
        setIsLoading(true)
        const books = await fetchMyBooks(id, token)
          if(books) {
            setUsersBooks(books)
            setIsLoading(false)
          }
      })()
    }, [setIsLoading, id, token])

    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id] : e.target.value,
    })) 
    }

    const onSubmit = async () => {
      if(!name || !email) {
        toast.error('Töltsd ki az összes kötelező mezőt.')
        return
      }
      setIsLoading(true)
        await updateUser(formData).then(data => { 
          if(data) {
            toast.success('Módosítottad az adataidat.')
            setChangeDetails(false)
            setIsLoading(false)
            } else {
              toast.error('Adataid nem változtak.')
              setIsLoading(false)
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
                      <button className="button button is-dark is-outlined is-responsive" onClick={() => {
                      changeDetails && onSubmit()
                      setChangeDetails((prevState) => !prevState)
                      }}>
                      {changeDetails ? (
                        <>
                          <span className="icon"><FaSave/></span>
                          <span>Mentés</span>
                        </>
                        ) : (
                          <>
                            <span className="icon"><FaUserEdit/></span>
                           <span>Adataim szerkesztése</span>
                          </>
                        )}
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
              <UserUploads user={user} usersBooks={usersBooks}/>
              <BackButton/>
          </main>
        </div> 
      )
}

export default Profile
