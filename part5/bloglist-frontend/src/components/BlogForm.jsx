import { useState } from 'react'
import PropTypes from 'prop-types'


const BlogForm = ({ handleCreation, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    handleCreation({
      title, 
      author, 
      url
    })
    
    setTitle('')
    setAuthor('')
    setUrl('')

    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <h2>Create New</h2>
      
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input
            type="author"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input
            type="url"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleCreation: PropTypes.func.isRequired,
  blogFormRef: PropTypes.object.isRequired
}

export default BlogForm