const mongoose = require('mongoose')

const nodeArg = process.argv

if (nodeArg.length < 3) {
  console.log('insert the password as argument')
  process.exit(1)
}

const password = nodeArg[2]

const newName = nodeArg[3]
const newNumber = nodeArg[4]

const url = `mongodb+srv://akunsampingan31:${password}@rifcluster.qmd6l.mongodb.net/phonebook?appName=RifCluster`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = new mongoose.model('Person', personSchema)

const person = new Person({
  name: newName,
  number: newNumber,
})

if (!newName || !newNumber) {
  Person.find({}).then((result) => {
    console.log('Phonbook : ')
    result.forEach((person) => {
      console.log(person.name + ' ' + person.number)
    })

    mongoose.connection.close()
  })
} else {
  person.save().then((result) => {
    console.log(`Added ${result.name} ${result.number} to Phonebook`)
    mongoose.connection.close()
  })
}
