const Blog = require('../Models/blog')

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
        likes: 0,
    })
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const blogsInsideDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    startupBlogs, nonExistingId, blogsInsideDb
}