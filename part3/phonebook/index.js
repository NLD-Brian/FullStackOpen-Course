require('dotenv').config()
const express = require('express');
const app = express()
const Person = require('./Models/person')
const morgan = require('morgan');

app.use(express.json())
app.use(express.static('dist'))
// Create a custom token for logging request body
morgan.token('req-body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '-'
});

// Configure morgan with custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).send("Person ID could not be found.").end()
        }
    })
        .catch(error => next(error))
})

//Delete a person by ID
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
    morgan('tiny')
})

app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Person.findById(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).send("Person ID could not be found.").end()
            }
            person.name = name
            person.number = number

            person.save().then(updatedPerson => {
                res.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${Person.length} people <br> ${date}`)
})


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)