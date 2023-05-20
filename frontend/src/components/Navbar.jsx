import { useState, useContext } from 'react'
import { FaBookOpen, FaSearch, FaSignOutAlt, FaUpload, FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import axios from 'axios'

const API_URL = '/books/search'

function Navbar({setFoundBooks}) {

  const [isActive, setIsActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const {user} = useContext(UserContext)
  const {logout} = useContext(UserContext)
  
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    toast.success('Sikeresen kiléptél.', {
      position: toast.POSITION.BOTTOM_RIGHT,
      theme: 'dark'
    })
    navigate('/')
  }

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(!searchTerm) {
      return toast.error('A kereséshez írj valamit a keresőmezőbe.', {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: 'dark'
      })
    }
    searchBooks(searchTerm)
  }

  const searchBooks = async (searchTerm) => {
    try {
      const res = await axios.get(API_URL + `?query=${searchTerm}`)
      const data = await res.data
      if(data) {
        setFoundBooks(data)
        navigate('books/search-results')
        setSearchTerm('')
      } 
    } catch (error) {
      setFoundBooks([])
      navigate('books/search-results')
      console.log(error)
    }
  }

    return (
        <>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item has-text-weight-bold is-size-4" to="/">
              <span className="icon is-small mr-1"><FaBookOpen/></span> 
              <span>QuantumBook</span>
            </Link>

    <Link onClick={() => setIsActive(!isActive)} role="button" className={isActive ? "navbar-burger is-active" : "navbar-burger"} aria-label="menu" aria-expanded="false" data-target="navbar">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </Link>
  </div>

  <div id="navbarBasicExample" className={isActive ? "navbar-menu is-active" : "navbar-menu"}>
    <div className="navbar-start">
      <div className="navbar-item">
       <form className='mt-2' onSubmit={handleSubmit}
      >
        <div className='field'>
          <div className="control has-icons-right">
              <input 
                onChange={handleChange}
                value={searchTerm} 
                className="input is-rounded" 
                type="text" 
                placeholder="Keresés"/>
              <span className="icon is-small is-right">
              <FaSearch/>
              </span>
          </div>
          </div>
       </form>
       </div>
    </div>

   {user ? (
    <>
     <div className="navbar-end">
    <div className='navbar-item'>
      <div className="buttons">
        <Link to={`/users/${user._id}`} className="button is-light is-active">
          <span className="icon"><FaUser/></span>
          <strong>{user.name}</strong>
        </Link>        
      </div>
     </div>
     <div className="navbar-item">
       <div className="buttons">
         <Link to="/new-book" className="button is-light">
            <span className="icon"><FaUpload/></span> 
            <span>Új könyv feltöltése</span>
            </Link>
         </div>
       </div>
     <div className="navbar-item">
       <div className="buttons">
         <button onClick={onLogout} className="button is-light">
          <span className="icon"><FaSignOutAlt/></span>
            <span>Kijelentkezés</span>
         </button>
       </div>
     </div>
   </div>
   </>
   ): 

    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <Link to='/register' className="button is-outlined is-dark">
            <span>Regisztráció</span>
          </Link>
          <Link to='/login' className="button is-light">
            Bejelentkezés
          </Link>
        </div>
      </div>
    </div>
    }
  </div>
</nav>
        </>
    )
}

export default Navbar
