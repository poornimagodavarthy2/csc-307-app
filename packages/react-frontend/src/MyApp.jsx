// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const idToRemove = characters[index].id;
    //call fetch to make the http delete request to the right route
    fetch(`http://localhost:8000/users/${idToRemove}`, {
      // use {method:'DELETE'} and append ID of object to the route URL
      method: "DELETE",
    }).then((response) => {
      // use http status code 204 for successful delete
      if (response.status === 204) {
        const updatedCharacters = [...characters];
        //remove user from characters array
        updatedCharacters.splice(index, 1);
        setCharacters(updatedCharacters);
        console.log("User deleted successfully");

        // 404 to represent resource not found
      } else if (response.status === 404) {
        console.log("User not found");
      } else {
        console.log("Failed to delete User");
      }
    });

    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }
  function updateList(person) {
    setCharacters([...characters, person]);
  }
  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      //.then(() => setCharacters([...characters, person]))
      .then((response) => {
        if (response.status === 201) {
          return response.json();
          //setCharacters([...characters, person]);
        } else {
          console.log("Failed to add user");
          return null;
        }
      })
      .then((data) => {
        //if data is not null, update state with added user
        if (data) {
          setCharacters([...characters, data]);
          console.log("User added successfully: ", data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    //update state with right representation of object we requested to be inserted
  }
}

export default MyApp;
