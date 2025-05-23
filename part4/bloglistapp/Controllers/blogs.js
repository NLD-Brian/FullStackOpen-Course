const bloglistRouter = require('express').Router()
const Blog = require('../Models/blog')
const User = require('../Models/user')
const jwt = require('jsonwebtoken')
const { tokenExtractor } = require('../utils/middleware')

bloglistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).sort({ likes: -1 })
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
    const user = request.user

    console.log('Request Token: ', request.token)
    console.log('User making the request: ', user)

    if (!request.token || !user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

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

bloglistRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    if (!blog.user || blog.user.toString() !== user._id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
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
        likes: request.body.likes !== undefined ? request.body.likes : blog.likes,
        user: blog.user
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        updatedData,
        { new: true }
    ).populate('user', { username: 1, name: 1 })
    response.json(updatedBlog)

})

module.exports = bloglistRouter

