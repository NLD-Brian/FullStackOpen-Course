import Blog from './Blog'
import Togglable from './Toggable'
import BlogForm from './BlogForm'
import {useRef} from 'react'
import PropTypes from 'prop-types'


const BlogPage = ({blogs, user, handleLogout, handleCreation, handleLikes, handleRemove}) => {
  const blogFormRef = useRef()


    return (
        <div>
              <h2>blogs</h2>
              <p>{user.username} logged in</p>
              <button onClick={handleLogout}>logout</button>
              <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm handleCreation={handleCreation} 
              blogFormRef={blogFormRef}/>
              </Togglable>
              {blogs.map(blog =>
                <Blog 
                key={blog.id} 
                blog={blog}
                handleLikes={handleLikes}
                handleRemove={handleRemove} />
              )}
            </div>
    )}

BlogPage.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleCreation: PropTypes.func.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default BlogPage