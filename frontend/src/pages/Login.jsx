import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaSignInAlt } from 'react-icons/fa'
import { UserContext } from '../context/UserContext'
import { toast } from 'react-toastify'


function Login() {

  const {login, user} = useContext(UserContext)
  
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    
    const { email, password } = formData

    const navigate = useNavigate()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }


       const onSubmit = async (e) => {
        e.preventDefault()

                const userData = { 
                email, 
                password
            }

          await login(userData).then(data => {
           if(data) {
              navigate('/')
              setFormData({
                  email: '',
                  password: '',
               }) 
               toast.success('Sikeres belépés', {
               position: toast.POSITION.BOTTOM_RIGHT,
               theme: 'dark'
               })      
             } else {
              toast.error('Hibás belépési adatok.', {
                position: toast.POSITION.BOTTOM_RIGHT,
                theme: 'dark'
              })
             }
        })
      }
  
      if(user) {
        return (
          <div className="column">
            <p>Már be vagy jelentkezve.</p>
          </div>
        )
      }
      
    return (
        <div className="column">
        <section className="hero has-background-grey is-small block">
            <div className='hero-body'>
               <p className='title has-text-light'>
                <span className="icon"><FaSignInAlt/></span> 
                 <span> Belépés</span>
                </p>
            </div>
            
        </section>
        <section className='form'>
          <form onSubmit={onSubmit}>
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
            <div className="field is-fullwidth mt-5">
                <div className="control">
                  <button className="button has-background-grey has-text-light">
                    <span className="icon"><FaSignInAlt/></span>
                    <span>Belépek</span>
                    </button>
                </div>
            </div>
            </form>
          </section>
          </div>
    )
}



export default Login

