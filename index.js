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

const generateId = () => {
    const minCeiled = Math.ceil(1)
    const maxFloored = Math.floor(1000)
    const newId = Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
    return String(newId)
  }

app.post('/api/persons', (request, response) => {
    const body = request.body


  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
        error: 'name must be unique'
    })
  }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})