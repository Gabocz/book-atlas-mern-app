import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { UserContext } from '../context/UserContext'


function Register() {

  const {registerUser} = useContext(UserContext)

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
                } else {
                    toast.error('Sikertelen regisztráció. Próbáld újra.', {
                      position: toast.POSITION.BOTTOM_RIGHT,
                      theme: 'dark'
                  })
                }
              })
            } 
          } 
    
    return (
        <>
        <section className="hero has-background-primary is-small block">
            <div className='hero-body'>
               <p className='title has-text-light'>
                <FaUser/> Regisztráció
                </p> 
            </div>  
        </section>
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
                  <button className="button has-background-primary has-text-light is-fullwidth">Regisztrálok</button>
                </div>
            </div>
            </form>
          </section>
          </>
    )
}

export default Register
