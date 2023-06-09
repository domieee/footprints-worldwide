import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Blogpage from './pages/Blogpage/Blogpage';
import { useEffect, useState, useContext, createContext } from 'react';
import Landingpage from './pages/Landingpage/Landingpage';
import './reset.scss'

import Editorpage from './pages/Editorpage/Editorpage';
import Navigation from './components/Navigation/Navigation';
import Login from './pages/UserValidation/Login';
import Register from './pages/UserValidation/Register';
import RegisterDetails from './pages/UserValidation/RegisterDetails';
import RegisterProgress from './pages/UserValidation/RegisterProgress';
import Protect from './components/Protect';

function App() {

  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(false)

  useEffect(() => {
    const loadPosts = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/`)
      const json = await response.json()
      setPosts(json)
    }
    loadPosts()
  }, [])

  useEffect(() => {
    const validateUserStatus = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND}/validate`, {
        credentials: 'include'
      })
      if (response.ok) {
        setUser(true)
      } else {
        setUser(false)
      }
    }
    validateUserStatus()
  }, [user])

  return (
    <BrowserRouter>
      <Navigation user={user} setUser={setUser} />
      <Routes>
        <Route path='/' element={<Landingpage user={user} setUser={setUser} data={posts} />} />
        <Route element={<Protect />}>
          <Route path='/editor' element={<Editorpage />} />
        </Route>
        <Route path='/login' element={<Login user={user} setUser={setUser} />} />
        <Route path='/register' element={<RegisterProgress />} >
          <Route path='1' element={<Register user={user} setUser={setUser} />} />
          <Route element={<Protect />}>
            <Route path='2' element={<RegisterDetails user={user} setUser={setUser} />} />
          </Route>
        </Route>
        <Route path='/posts/:id' element={<Blogpage posts={posts} />} />
      </Routes>
    </BrowserRouter >
  )
}

export default App
