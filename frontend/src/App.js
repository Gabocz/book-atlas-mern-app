import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { UserContextProvider} from "./context/UserContext"
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewBook from './pages/NewBook'
import MyProfile from './pages/MyProfile'
import UserProfile from './pages/UserProfile'
import Book from './pages/Book'
import EditBook from './pages/EditBook'
import SearchResults from './pages/SearchResults'
import NotFound from './components/NotFound'
import Footer from './components/Footer'


function App() {

    const [foundBooks, setFoundBooks] = useState([])
    const [isLoading, setIsLoading] = useState(false)


   return (
    <>
      <UserContextProvider>
      <Router>
      <div className='container is-fluid'>
      <Navbar setFoundBooks={setFoundBooks} setIsLoading={setIsLoading}/>
      <Routes>
        <Route path='/' element={<Home setIsLoading={setIsLoading} isLoading={isLoading} />} />
        <Route path='books/:id' element={<Book setIsLoading={setIsLoading} isLoading={isLoading}/>}/>
        <Route path='/books/:id/edit' element={<PrivateRoute/>}>
        <Route path='/books/:id/edit' element={<EditBook setIsLoading={setIsLoading} isLoading={isLoading}/>}/>
        </Route>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register setIsLoading={setIsLoading} isLoading={isLoading}/>} />
        <Route path='/new-book' element={<PrivateRoute/>}>
        <Route path='/new-book' element={<NewBook setIsLoading={setIsLoading} isLoading={isLoading}/>}/>
        </Route>
        <Route path='/users/my-profile' element={<PrivateRoute/>}>
        <Route path='/users/my-profile' element={<MyProfile setIsLoading={setIsLoading} isLoading={isLoading}/>}/>
        </Route>
        <Route path='/users/:id' element={<UserProfile setIsLoading={setIsLoading} isLoading={isLoading}/>}/>
        <Route path='/books/search-results' element={<SearchResults foundBooks={foundBooks} isLoading={isLoading}/>}>
        </Route>
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
       </div>
      </Router>
      <Footer/>
      <ToastContainer position='bottom-right' theme='dark'/>
      </UserContextProvider>
    </>
  );
}

export default App;
