const bloglistRouter = require('express').Router()
const blog = require('../Models/blog')
const Blog = require('../Models/blog')

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

bloglistRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

bloglistRouter.post('/', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    blog.save().then(savedBlog => {
        response.json(savedBlog)
    })
        .catch(error => next(error))
})

bloglistRouter.delete('/:id', (request, response) => {
    const blog = Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

bloglistRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).end()
    }

    const updatedData = {
        title: request.body.title || blog.title,
        author: request.body.author || blog.author,
        url: request.body.url || blog.url,
        likes: request.body.likes !== undefined ? request.body.likes : blog.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedData,
    )
    response.json(updatedBlog)

})

module.exports = bloglistRouter

