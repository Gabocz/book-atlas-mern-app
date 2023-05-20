import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaRegUser, FaEnvelope, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'
import Spinner from '../components/Spinner'


function Register({ setIsLoading, isLoading }) {

  const { registerUser } = useContext(UserContext)
  
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })
    
    const { name, email, password, password2 } = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

       const onSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault()

        if(password !== password2) {
            toast.error('A jelszavak nem egyeznek.', {
              position: toast.POSITION.BOTTOM_RIGHT,
              theme: 'dark'
            })
        } else {
            const userData = {
                name, 
                email, 
                password
            }
                await registerUser(userData).then(data => {
                  if(data) {
                    toast.success('Sikeres regisztráció', {
                      position: toast.POSITION.BOTTOM_RIGHT,
                      theme: 'dark'
                    })
                    navigate('/')
                    setFormData({
                       name: '',
                       email: '',
                       password: '',
                       password2: ''
                 })
                 setIsLoading(false)
                } else {
                    toast.error('Sikertelen regisztráció. Próbáld újra.', {
                      position: toast.POSITION.BOTTOM_RIGHT,
                      theme: 'dark'
                  })
                }
              })
            } 
          } 

    if(isLoading) {
            return <Spinner/>
      }
    
    return (
        <div className="column">
        <header className="block px-2 py-2">
          <h1 className="title is-3">
            <i className='mr-2'><FaRegUser/></i>
            Regisztráció
          </h1>   
        </header>
        <section className='form'>
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
                      placeholder="Név"
                      required
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
                      placeholder="Email"
                      required
                    />
                    <span className="icon is-small is-left">
                      <FaEnvelope/>
                    </span>
                  </div>
            </div>
            <div className="field">
                <label id="password" className="label">Jelszó</label>
                  <div className="control">
                    <input
                      id="password"
                      name="password" 
                      value={password}
                      onChange={onChange}
                      className="input" 
                      type="password" 
                      placeholder="Jelszó"
                      required
                      autoComplete="true"
                    />
                  </div>
            </div>
            <div className="field">
                <label id="password2" className="label">Jelszó még egyszer</label>
                  <div className="control">
                    <input
                      id="password2"
                      name="password2"
                      value={password2}
                      onChange={onChange}
                      className="input" 
                      type="password" 
                      placeholder="Jelszó még egyszer"
                      required
                      autoComplete="true"
                    />
                  </div>
            </div>
            <div className="field is-fullwidth mt-5">
                <div className="control">
                  <button className="button is-outlined is-link">
                    <span className="icon"><FaCheck/></span>
                    <span>Regisztrálok</span>
                  </button>
                </div>
            </div>
            </form>
          </section>
          </div>
    )
}

export default Register
