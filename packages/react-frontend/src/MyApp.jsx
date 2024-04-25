import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const idToRemove = characters[index]._id; // Assuming your backend returns _id
    fetch(`http://localhost:8000/users/${idToRemove}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          const updatedCharacters = [...characters];
          updatedCharacters.splice(index, 1);
          setCharacters(updatedCharacters);
          console.log("User deleted successfully");
        } else if (response.status === 404) {
          console.log("User not found");
        } else {
          console.log("Failed to delete User");
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log("Failed to add user");
          return null;
        }
      })
      .then((data) => {
        if (data) {
          setCharacters([...characters, data]);
          console.log("User added successfully: ", data);
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((json) => json.users_list)
      .catch((error) => {
        console.error("Error fetching users:", error);
        return [];
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((users) => setCharacters(users))
      .catch((error) => {
        console.error("Error setting characters:", error);
      });
  }, []);

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
