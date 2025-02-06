require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const morgan = require('morgan')
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
]

app.get('/info', (request, response) => {
    const today = Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${today}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
  })

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})