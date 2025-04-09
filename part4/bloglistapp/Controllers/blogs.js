const bloglistRouter = require('express').Router()
const Blog = require('../Models/blog')

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

bloglistRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id).then(blog => {
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => next(error))
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

module.exports = bloglistRouter

