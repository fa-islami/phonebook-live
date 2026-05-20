require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

console.log(app)

morgan.token('body', (req) => JSON.stringify(req.body))

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    res.status(400).send({ error: 'Malformatted ID' })
  } else if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message })
  }

  next(err)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

// READ
app.get('/api/persons/', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((selectedPerson) => {
      if (!selectedPerson)
        return res.status(404).json({ error: 'Person not found' })
      res.json(selectedPerson)
    })
    .catch((err) => next(err))
})
app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    console.log(persons)
    const infoText = `<p>Phonebook has info for ${persons.length} persons</p>
    <p>${new Date()}</p>`
    res.send(infoText)
  })
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

// CREATE
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((err) => next(err))
})

// UPDATE
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).end()

      person.name = name
      person.number = number

      person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch((err) => next(err))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
