import express from "express";
import bodyParser from "body-parser";
import { DataStore } from "notarealdb";

import cors from "cors";
const app = express();
const port = 8080;

const store = new DataStore("./fake-data");
const tasks = store.collection("tasks"); // db for tasks
const users = store.collection("users"); // db for users
const infos = store.collection("info"); // db for info

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // json is working well
app.use(cors());

// tasks

app.get("/tasks", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json(tasks.list()); // get all tasks
});

app.post("/create", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { usernames, tags, done, deadline, author } = req.body;
  tasks.create({ usernames, tags, done, deadline, author });
  res.json({ usernames, tags, done, deadline, author });
});

app.put("/change", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id, usernames, tags, done, deadline, author } = req.body; // to change, all data together is must be written
  tasks.update({ id, usernames, tags, done, deadline, author });
  res.json({ id, usernames, tags, done, deadline, author });
});

app.post("/delete", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { yd } = req.body;
  tasks.delete(id);
  res.status(200).send();
});

app.put("/done", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.body;
  const plan = tasks.get(id);
  var { usernames, tags, done, deadline, author } = plan;
  done = !done; // changing from true to false, or from false to true
  tasks.update({ id, usernames, tags, done, deadline, author });
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
  res.header("Access-Control-Allow-Origin", "*");
  const { username, password } = req.body;
  const tasks = users.list();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].username === username && tasks[i].password === password) {
      // checking if account is already exists
      res.json("You already have an account");
      return;
    }
  }
  users.create({ username, password }); // if no, create it
  res.json({ username, password });
});

app.post("/logyn", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { username, password } = req.body;
  const tasks = users.list();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[j].username === username && tasks[j].password === password) {
      // if account in DB
      res.json("Login successfully");
      return;
    }
  }
  res.json("You probably don't have an account.");
});

app.post("/info", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { info, username } = req.body;
  const infolar = infos.list();
  for (let i = 0; i < infolar.length; i++) {
    // checking if info is already exists
    if (infolar[i].username === username && infolar[i].info === info) {
      res.json("Info already exists");
      return;
    }
  }
  infos.create({ info, username }); // if no, create
  res.json({ info, username });
});

app.listen(port, () => {
  console.log("SERVER STARTED!");
});
