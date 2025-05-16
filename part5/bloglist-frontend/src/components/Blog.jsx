import Togglable from "./Toggable"
import { useRef } from "react"
import PropTypes from 'prop-types'


const Blog = ({ blog, handleLikes, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const detailsRef = useRef()

  const addLike = () => {
    handleLikes(blog.id)
    console.log('Like button clicked')
  }
  const removeBlog = () => {
    handleRemove(blog.id)
    console.log('Remove button clicked')
  }

  return (
  <div style={blogStyle}>
    {blog.title}
    <Togglable buttonLabel="view" ref={detailsRef}>
       <div> {blog.author}
        <br />
        {blog.url}
        <br />
        {blog.likes} likes
        <button onClick={addLike}>like</button>
        <br />
        Added by: {blog.user ? blog.user.username : "Unknown"}
        <br />
        <button onClick={removeBlog}>remove</button>
       </div>

    </Togglable>
  </div>  
)}


Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog