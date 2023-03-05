import { useContext } from 'react'
import { FaBookOpen, FaSearch, FaSignOutAlt, FaUpload } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'

function Navbar() {

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

    return (
        <>
        <nav className="navbar" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <Link className="navbar-item has-text-weight-bold is-size-4" to="/">
      <FaBookOpen className='mr-1'/> SimpleBook
    </Link>

    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" className="navbar-menu">
    <div className="navbar-start">
       <form className='mt-2'>
        <div className='field'>
          <div className="control has-icons-right">
              <input className="input is-rounded" type="text" placeholder="Keresés"/>
              <span className="icon is-small is-right">
              <FaSearch/>
              </span>
          </div>
          </div>
       </form>
    </div>

   {user ? (
    <>
     <div className="navbar-end">
    <div className='navbar-item'>
     <p>Szia, <Link to={`/users/${user._id}`}><strong>{user.name}</strong>!</Link></p>
     </div>
     <div className="navbar-item">
       <div className="buttons">
         <button className="button is-light">
           <Link to="/new-book"><FaUpload/> Új könyvet töltök fel</Link>
         </button>
       </div>
     </div>
     <div className="navbar-item">
       <div className="buttons">
         <button onClick={onLogout} className="button is-light">
           <FaSignOutAlt/> Kijelentkezés
         </button>
       </div>
     </div>
   </div>
   </>
   ): 

    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <Link to='/register' className="button has-background-danger has-text-light">
            <strong>Regisztráció</strong>
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
