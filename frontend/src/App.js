import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { UserContextProvider} from "./context/UserContext";
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NewBook from './pages/NewBook'
import Profile from './pages/Profile'
import Book from './pages/Book';
import EditBook from './pages/EditBook';
import SearchResults from './pages/SearchResults';




function App() {

    const [foundBooks, setFoundBooks] = useState([])


   return (
    <>
    <UserContextProvider>
    <Router>
    <div className='container is-fluid'>
    <Navbar setFoundBooks={setFoundBooks}/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='books/:id' element={<Book/>}/>
      <Route path='/books/:id/edit' element={<PrivateRoute/>}>
      <Route path='/books/:id/edit' element={<EditBook/>}/>
      </Route>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/new-book' element={<PrivateRoute/>}>
      <Route path='/new-book' element={<NewBook/>}/>
      </Route>
      <Route path='/users/:id' element={<PrivateRoute/>}>
      <Route path='/users/:id' element={<Profile/>}/>
      </Route>
      <Route path='/books/search-results' element={<SearchResults foundBooks={foundBooks}/>}>
      </Route>
    </Routes>
     </div>
    </Router>
    <ToastContainer/>
    </UserContextProvider>
    </>
  );
}

export default App;
