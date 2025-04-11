const Blog = require('../Models/blog')
const User = require('../Models/user')

const startupBlogs = [
    {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://example.com',
        likes: 5,
    },
    {
        title: 'Test Blog 2',
        author: 'Test Author 2',
        url: 'https://example2.com',
        likes: 10,
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Temporary Blog',
        author: 'Temporary Author',
        url: 'https://temporary.com',
        likes: 2,
    })
    console.log('blog', blog)
    await blog.save()
    await blog.deleteOne()

    const blogid = blog._id.toString()
    console.log(blogid)

    return blog._id.toString()
}

const blogsInsideDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInsideDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    startupBlogs, nonExistingId, blogsInsideDb, usersInsideDb
}