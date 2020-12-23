const express = require("express");
const app = express();
const port = 3001;

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
    res.status(404).json({ error: "Not found" });
  }
});

app.get("/info", (req, res) => {
  return res.send(`Phonebook has info for ${persons.length} people
    ${new Date()}
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
