import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import { FaEnvelope, FaSignInAlt, FaRegUser } from 'react-icons/fa'
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
               toast.success('Sikeres belépés.')     
             } else {
              toast.error('Hibás belépési adatok.')
             }
        })
      }
  
      if(user) {
        return (
          <div className="column">
            <h1 className="title is-5">Már be vagy jelentkezve.</h1>
            <BackButton/>
          </div>
        )
      }
      
    return (
        <div className="column">
         <header className="block px-2 py-2">
          <h1 className="title is-3 is-size-4-mobile">
            <i className='mr-2'><FaSignInAlt/></i>
            Belépés
          </h1>   
        </header>
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
            <div className="field is-fullwidth mt-4">
                <div className="control">
                  <button className="button is-outlined is-dark is-responsive">
                    <span className="icon"><FaSignInAlt/></span>
                    <span>Belépek</span>
                    </button>
                </div>
            </div>
            </form>
            <div className='mt-4'>
              <button className="button is-responsive">
                <span className="icon"><FaRegUser/></span>
                <span>Demó</span>
              </button>
            </div>
          </section>
          </div>
    )
}



export default Login

