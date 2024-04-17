// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};
app.get("/", (req, res) => (
  res.send("Hello World!")
));

// get all users
app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (name && job) {
    // Both name and job parameters are provided
    const filteredUsers = users.users_list.filter(
      (user) => user.name === name && user.job === job
    );
    res.json({ users_list: filteredUsers });
  } else if (name) {
    // Only name parameter is provided
    const filteredUsers = users.users_list.filter((user) => user.name === name);
    res.json({ users_list: filteredUsers });
  } else if (job) {
    // Only job parameter is provided
    const filteredUsers = users.users_list.filter((user) => user.job === job);
    res.json({ users_list: filteredUsers });
  } else {
    // No parameters provided, return all users
    res.json(users);
  }
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);
  
app.use(cors());
app.use(express.json());

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.send();
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  const index = users.users_list.findIndex((user) => user.id == id);
  if (index !== -1) {
    users.users_list.splice(index, 1);
    res.status(200).send("User deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  let filteredUsers = users.users_list;
  if (name) {
    filteredUsers = filteredUsers.filter((user) => user.name === name);
  }
  if (job) {
    filteredUsers = filteredUsers.filter((user) => user.job === job);
  }
  res.json({ users_list: filteredUsers });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
