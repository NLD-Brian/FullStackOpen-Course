const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../Models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 24 * 60 * 60 } // 24 hours
    )

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.SECRET,
        { expiresIn: 30 * 24 * 60 * 60 } // 30 days
    )

    user.refreshToken = refreshToken
    await user.save()

    response
        .status(200)
        .send({ token, refreshToken, username: user.username, name: user.name })
})



module.exports = loginRouter