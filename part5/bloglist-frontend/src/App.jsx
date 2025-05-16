import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogPage from './components/BlogPage'
import './index.css'
import axios from 'axios'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const checkAndRefreshToken = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('User from localStorage:', user)
      console.log('RefreshToken exists:', user.refreshToken)

      // If there's a refresh token, get a new access token
      if (user.refreshToken) {
        try {
          const response = await axios.post('http://localhost:3001/api/login/refresh', {
            refreshToken: user.refreshToken
          })
          
          // Update the token in the user object
          user.token = response.data.token
          
          // Save updated user object
          window.localStorage.setItem('loggedUser', JSON.stringify(user))
          
          // Set up for use
          setUser(user)
          blogService.setToken(user.token)
        } catch (error) {
          // If refresh fails, clear the user data
          window.localStorage.removeItem('loggedUser')
          setUser(null)
        }
      } else {
      setUser(user)
        blogService.setToken(user.token)
      }
    }
  }
  
  checkAndRefreshToken()
}, [])

  const handleCreation = async (newBlog) => {
    const returnedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(returnedBlog))
    setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
       
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }
  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)) {
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setSuccessMessage(`Removed ${blogToRemove.title} by ${blogToRemove.author}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
  }

  const handleLikes = async (id) => {
    const blogToUpdate = blogs.find(b => b.id === id)
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    const returnedBlog = await blogService.update(id, updatedBlog)
    setSuccessMessage(`You liked ${returnedBlog.title} by ${returnedBlog.author}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)

    const updatedBlogs = blogs.map(blog => (blog.id !== id ? blog : returnedBlog))
    updatedBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(updatedBlogs)
}

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )


  return (
    <div>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}

      {user === null ? 
     loginForm() :
     <div>
     <BlogPage 
     blogs={blogs} 
     user={user} 
     handleLogout={handleLogout}
     handleCreation={handleCreation}
     handleLikes={handleLikes}
     handleRemove={handleRemove}/>
     </div>
      }
    </div>
  )
}

export default App