const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Provide password as an argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://brianneut:${password}@cluster0.wp6ekwi.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: number,
})

if (!process.argv[3] || !process.argv[4]) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
else {
    person.save().then(() => {
        console.log('Added', name, 'number', number, 'to phonebook')
        mongoose.connection.close()
    })
}