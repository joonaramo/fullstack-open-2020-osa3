require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

const Person = require("./models/person");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());
app.use(cors());

app.get("/api/persons", async (req, res) => {
  const persons = await Person.find();
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

app.delete("/api/persons/:id", async (req, res) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({
      error: "missing name or number",
    });
  }

  const newPerson = new Person({
    name,
    number,
  });

  const person = await newPerson.save();
  res.json(person);
});

app.get("/info", (req, res) => {
  return res.send(`Phonebook has info for ${persons.length} people
    ${new Date()}
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
