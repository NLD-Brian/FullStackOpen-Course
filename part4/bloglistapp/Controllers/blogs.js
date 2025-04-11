const bloglistRouter = require('express').Router()
const Blog = require('../Models/blog')
const User = require('../Models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor } = require('../utils/middleware')

// const getTokenFrom = request => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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

bloglistRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(body.user)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
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

