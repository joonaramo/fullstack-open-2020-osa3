const express = require("express");
const app = express();
const port = 3001;

app.use(express.json());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = persons.find((person) => person.id === id);
  if (found) {
    res.json(found);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const { body } = req;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "missing name or number",
    });
  }
  const found = persons.find((person) => person.name === body.name);
  if (found) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const newPerson = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 99999),
  };
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.get("/info", (req, res) => {
  return res.send(`Phonebook has info for ${persons.length} people
    ${new Date()}
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
