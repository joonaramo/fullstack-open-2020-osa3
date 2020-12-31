const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://root:${password}@phonebook.tu6vc.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (!name && !number) {
  console.log('phonebook:');
  const getAllPersons = async () => {
    const persons = await Person.find();
    persons.map((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  };
  return getAllPersons();
}

const addNewPerson = async () => {
  const newPerson = new Person({
    name,
    number,
  });
  const person = await newPerson.save();
  console.log(`added ${person.name} number ${person.number} to phonebook`);
  mongoose.connection.close();
};

addNewPerson();
