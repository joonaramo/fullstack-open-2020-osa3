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

app.get("/api/persons", async (req, res, next) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).end();
    }
    res.json(person);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
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

  try {
    const person = await newPerson.save();
    res.json(person);
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({
      error: "missing name or number",
    });
  }
  const person = {
    name,
    number,
  };
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      person,
      { new: true }
    );
    res.json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

app.get("/info", async (req, res) => {
  const count = await Person.estimatedDocumentCount();
  return res.send(`Phonebook has info for ${count} people
    ${new Date()}
  `);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
