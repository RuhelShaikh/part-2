import React, { useState, useEffect } from "react";
import personServ from "./services/persons";

const Filter = ({ text, value, handleNewChange }) => {
  return (
    <div>
      {text} <input value={value} onChange={handleNewChange} />
    </div>
  );
};

const Form = ({ submitName, newName, inputName, newNumber, inputNumber }) => {
  return (
    <form onSubmit={submitName}>
      <div>
        name: <input value={newName} onChange={inputName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={inputNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ personAfterFilter }) => {
  return <ul>{personAfterFilter}</ul>;
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="message">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personServ.initPersons().then((response) => {
      setPersons(response);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setNewFilter] = useState("");
  const [message, setNewMessage] = useState(null);

  const delUser = async (userId, name) => {
    const shouldDelete = window.confirm(`Delete ${name}?!`);

    if (shouldDelete) {
      console.log(`Deleting user with ID: ${userId}`);

      try {
        // Perform the deletion
        await personServ.del(userId);

        // Update the state
        setPersons((persons) =>
          persons.filter((person) => person.id !== userId)
        );

        console.log(`User with ID ${userId} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
      }
    } else {
      console.log("Deletion canceled.");
    }
  };

  const inputName = (e) => {
    setNewName(e.target.value);
  };

  const inputNumber = (e) => {
    setNewNumber(e.target.value);
  };

  const submitName = async (e) => {
    e.preventDefault();
    // Check if the name already exists
    if (persons.find((person) => person.name === newName)) {
      const personRe = persons.find((person) => person.name === newName);
      const userId = personRe.id;
      const name = personRe.name;

      const shouldUpdate = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      );

      if (shouldUpdate) {
        try {
          const updatedUser = await personServ.reNum(userId, newNumber, name);

          setPersons((persons) =>
            persons.map((person) =>
              person.id === userId ? updatedUser : person
            )
          );

          setNewMessage(`${updatedUser.name}'s number was updated`);
          console.log(`User with ID ${userId} updated successfully.`);
        } catch (error) {
          console.error(`Error updating user with ID ${userId}:`, error);
          setNewMessage(
            error.response && error.response.status === 404
              ? `Information of ${name} has already been removed from the server`
              : `Failed to update ${name}'s number.`
          );
        }
      }

      setTimeout(() => {
        setNewMessage(null);
      }, 20000);
      setNewName("");
      setNewNumber("");
    } else {
      personServ
        .create({ name: newName, number: newNumber })
        .then((response) => {
          setPersons(persons.concat(response));
          setNewMessage(`Added ${response.name}`);
        });
      setNewName("");
      setNewNumber("");
      setTimeout(() => {
        setNewMessage(null);
      }, 2000);
    }
  };

  const filterName = (e) => {
    setNewFilter(e.target.value);
  };

  const filterArr = persons.filter((person) => {
    if (person.name) {
      return person.name.toLowerCase().includes(filter.toLowerCase());
    } else {
      return false;
    }
  });

  const personsToDisplay = filterArr.length > 0 ? filterArr : persons;

  const personAfterFilter = personsToDisplay.map((person) => (
    <li key={person.name}>
      {person.name} {person.number}{" "}
      <button onClick={() => delUser(person.id, person.name)}>delete</button>
    </li>
  ));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter
        text="filter shown with"
        value={filter}
        handleNewChange={filterName}
      />
      <h2>add a new</h2>
      <Form
        submitName={submitName}
        newName={newName}
        inputName={inputName}
        newNumber={newNumber}
        inputNumber={inputNumber}
      />
      <h2>Numbers</h2>
      <Persons personAfterFilter={personAfterFilter} />
    </div>
  );
};

export default App;
