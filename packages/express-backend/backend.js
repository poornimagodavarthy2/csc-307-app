// backend.js
import express from "express";
import cors from "cors";
import userService from "./user-services.js";

const app = express();
const port = 8000;

app.get("/", (req, res) => res.send("Hello World!"));

app.use(cors());
app.use(express.json());

// get all users
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  if (name && job) {
    userService
      .findUser(name, job)
      .then((users) => {
        res.json({ users_list: users });
      })
      .catch((error) => {
        console.error("Error getting users", error);
        res.status(500).send("Internal server error");
      });
  } else {
    userService
      .getUsers(name, job)
      .then((users) => {
        res.json({ users_list: users });
      })
      .catch((error) => {
        console.error("Error getting users", error);
        res.status(500).send("Internal server error");
      });
  }
});

// Post a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService
    .addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).json(addedUser);
    })
    .catch((error) => {
      console.error("Error adding user:", error);
      res.status(500).send("Internal server error");
    });
});

//get a user by id
app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService
    .findUserById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.json(user);
      }
    })
    .catch((error) => {
      console.error("Error finding user:", error);
      res.status(500).send("Internal server error");
    });
});

// delete user by id

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService
    .deleteUserById(id)
    .then(() => {
      res.status(204).send("User deleted successfully");
    })
    .catch((error) => {
      console.error("Error deleting user: ", error);
      res.status(500).send("Internal server error");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
