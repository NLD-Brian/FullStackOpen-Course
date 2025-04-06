require('dotenv').config()
const express = require('express')
const Note = require('./Models/note')
const app = express()


// let notes = [
//     {
//       id: "1",
//       content: "HTML is easy",
//       important: true
//     },
//     {
//       id: "2",
//       content: "Browser can execute only JavaScript",
//       important: false
//     },
//     {
//       id: "3",
//       content: "GET and POST are the most important methods of HTTP protocol",
//       important: true
//     }
//   ]
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:', req.path)
  console.log('Body:', req.body)
  console.log('---')
  next()
}
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

// Middleware to log the request method and URL
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})
app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    }
    else {
      res.status(404).send("Note ID could not be found.").end()
    }
  })
    .catch(error => next(error))
})
app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndDelete(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))
})
app.post('/api/notes', (req, res, next) => {
  const body = req.body
  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  note.save().then(savedNote => {
    res.json(savedNote)
  })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  Note.findById(req.params.id)
    .then(note => {
      if (!note) {
        return res.status(404).send("Note ID could not be found.").end()
      }
      note.content = content
      note.important = important

      return note.save().then(updatedNote => {
        res.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)