const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../Models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token

    if (!token) {
        return next()
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (decodedToken.id) {
            const user = await User.findById(decodedToken.id)

            if (user) {
                request.user = user
            }
        }
        next()
    } catch (error) {
        // Handle JWT verification errors gracefully
        // Don't set request.user, so auth checks will fail appropriately
        console.log('Token verification failed:', error.message)
        next()
    }
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}