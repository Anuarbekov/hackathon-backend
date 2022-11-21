import express from "express";
import bodyParser from "body-parser";
import { DataStore } from "notarealdb";
const app = express();
const port = 8080;

const store = new DataStore("./fake-data");
const plans = store.collection("plans");
const users = store.collection("users");
const infos = store.collection("info");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// tasks
app.post("/create", (req, res) => {
  const { usernames, tags, done, deadline, author } = req.body;
  plans.create({ usernames, tags, done, deadline, author });
  res.json({ usernames, tags, done, deadline, author });
});

app.get("/tasks", (req, res) => {
  res.json(plans.list());
});

app.put("/change", (req, res) => {
  const { id, usernames, tags, done, deadline, author } = req.body; // all data together
  plans.update({ id, usernames, tags, done, deadline, author });
  res.json({ id, usernames, tags, done, deadline, author });
});

app.delete("/delete", (req, res) => {
  const { id } = req.body;
  plans.delete(id);
  res.status(200).send();
});

app.put("/done", (req, res) => {
  const { id } = req.body;
  const plan = plans.get(id);
  var { usernames, tags, done, deadline, author } = plan;
  done = !done;
  plans.update({ id, usernames, tags, done, deadline, author });
  res.json({
    id: id,
    usernames: usernames,
    tags: tags,
    done: done,
    deadline: deadline,
    author: author,
  });
});

// users
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const tasks = users.list();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].username === username && tasks[i].password === password) {
      res.json("You already have an account");
      return;
    }
  }
  users.create({ username, password });
  res.json({ username, password });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const tasks = users.list();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].username === username && tasks[i].password === password) {
      res.json("Login successfully");
      return;
    }
  }
  res.json("You probably don't have an account.");
});

app.post("/info", (req, res) => {
  const { info, username } = req.body;
  const infolar = infos.list();
  for (let i = 0; i < infolar.length; i++) {
    if (infolar[i].username === username && infolar[i].info === info) {
      res.json("Info already exists");
      return;
    }
  }
  infos.create(info, username);
  res.json({ info, username });
});

app.listen(port, () => {
  console.log("SERVER STARTED!");
});
