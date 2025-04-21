import Blog from './Blog'


const BlogPage = ({blogs, user, handleLogout}) => {
    return (
        <div>
              <h2>blogs</h2>
              <p>{user.username} logged in</p>
              <button onClick={handleLogout}>logout</button>
              
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
    )}

export default BlogPage