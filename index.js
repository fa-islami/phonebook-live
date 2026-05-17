const express = require("express");
const morgan = require("morgan");
const app = express();

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);
app.use(express.static("dist"));

// morgan("tiny");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => String(parseInt(Math.random() * 92837535365376));

app.get("/api/persons/", (req, res) => {
  res.json(persons);
});
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (!person) res.status(404).end();
  res.json(person);
});
app.get("/info", (req, res) => {
  const infoText = `<p>Phonebook has info for ${persons.length}</p>
  <p>${new Date()}</p>`;
  res.send(infoText);
});
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});
app.post("/api/persons", (req, res) => {
  const body = req.body;
  const isNameExisted = persons.some((p) => p.name === body.name);

  if (!body.name || !body.number)
    return res.status(400).json({ error: "Missing Name or Number" });
  if (isNameExisted)
    return res.status(400).json({ error: "name must be unique" });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
