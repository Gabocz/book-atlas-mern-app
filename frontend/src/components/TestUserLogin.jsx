import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { FaRegUser } from "react-icons/fa"
import { UserContext } from "../context/UserContext"
import { toast } from 'react-toastify'

const testUser = { 
    email: "teszt@teszt.com", 
    password: "secret"
}

function TestUserLogin() {
    const { login } = useContext(UserContext)
    const navigate = useNavigate()

    const loginTestUser = async() =>  {
        await login(testUser)
        navigate('/')
        toast.success('Sikeres belépés.') 
    }

    return (
          <button onClick={loginTestUser} className="button is-responsive">
          <span className="icon"><FaRegUser/></span>
          <span>Demó</span>
          </button>
    )
}

export default TestUserLogin
