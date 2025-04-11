const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { title } = require('process')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../Models/blog')
const User = require('../Models/user')
const { url } = require('node:inspector')

describe('API Test - Some blogs are being added', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.startupBlogs)

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
})

describe('Get specific blog', () => {
    test('returns a blog post with a valid id', async () => {
        const blogsAtStart = await helper.blogsInsideDb()
        const blogToView = blogsAtStart[0]

        const response = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.deepStrictEqual(response.body, blogToView)
    })

    test('returns 404 if blog post does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()
        await api
            .get(`/api/blogs/${validNonExistingId}`)
            .expect(404)
    })
})

describe('adding new blogs', () => {
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

    test('POST request to /api/blogs fails with status code 400 if title or url is missing', async () => {
        const testBlog = {
            author: 'Test Author',
            likes: 5,
        }

        await api
            .post('/api/blogs')
            .send(testBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })
})

describe('Deleting blogs', () => {
    test('DELETE request to /api/blogs/:id removes a blog post from the database', async () => {
        const blogsAtStart = await helper.blogsInsideDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
    })
})

describe('Updating blogs', () => {
    test('PUT request to /api/blogs/:id updates a blog post in the database', async () => {
        const blogsAtStart = await helper.blogsInsideDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            likes: 100
        }
        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInsideDb()
        const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes)
    })
})

describe('Authentication tests', () => {

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('password123', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })

    test.only('creating a new user', async () => {
        const usersAtStart = await helper.usersInsideDb()

        const newUser = {
            username: 'testuser',
            name: 'Test User',
            password: 'password123'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInsideDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test.only('creating a new user fails with status code 400 if username or password is missing', async () => {
        const usersAtStart = await helper.usersInsideDb()
        const newUser = {
            name: 'Test User',
            password: 'password123'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInsideDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test.only('creating a new user fails with status code 400 if username or password is too short', async () => {
        const usersAtStart = await helper.usersInsideDb()
        const newUser = {
            username: 'tu',
            name: 'Test User',
            password: 'pw'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInsideDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})