const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { title } = require('process')
const api = supertest(app)

const Blog = require('../Models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.startupBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('Unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.strictEqual(typeof blog.id, 'string', 'id property is missing or not a string')
        assert.strictEqual(blog._id, undefined, '_id property should not be present')
    })
})

test('POST request to /api/blogs creates a new blog post and saves it in to the database', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'https://example.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInsideDb()
    assert.strictEqual(blogsAtEnd.length, helper.startupBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Test Blog'))
})

test('likes property defaults to 0 if not provided', async () => {
    const testBlog = {
        title: 'Test Blog likes',
        author: 'Test Author',
        url: 'https://example.com',
    }

    const response = await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAfterTest = await helper.blogsInsideDb()
    const addedBlog = blogsAfterTest.find(blog => blog.id === response.body.id)
    assert.strictEqual(addedBlog.likes, 0, 'likes property should default to 0')

})