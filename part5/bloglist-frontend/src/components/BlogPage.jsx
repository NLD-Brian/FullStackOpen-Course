import Blog from './Blog'


const BlogPage = ({blogs, user}) => {
    return (
        <div>
              <h2>blogs</h2>
              <p>{user.username} logged in</p>
              
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
    )}

export default BlogPage