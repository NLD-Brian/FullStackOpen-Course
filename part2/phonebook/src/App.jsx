import { useState, useEffect } from "react";
import phonebookService from "./services/phonebook";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons);
      })
  }, []);

  const personsExist = persons.some((person) => person.name === newName);

  const addContact = (event) => {
    event.preventDefault();
    if (personsExist) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find((person) => person.name === newName);
        const updatedPerson = { ...personToUpdate, number: newNumber };
        phonebookService.update(personToUpdate.id, updatedPerson).then((returnedPerson) => {
          setPersons(persons.map((person) => (person.id !== personToUpdate.id ? person : returnedPerson)));
          setNewName("");
          setNewNumber("");
          setNotification(`Updated ${returnedPerson.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 2500);
        })
        .catch(error => {
          setNotification(`${personToUpdate.name} was already deleted from server`);
          setTimeout(() => {
            setNotification(null);
          }, 2500);
          setPersons(persons.filter((person) => person.id !== personToUpdate.id));
      });
      }
      return;
    }
    const nameObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };
    setPersons(persons.concat(nameObject));
    setNewName("");
    setNewNumber("");

    phonebookService
      .create(nameObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setNotification(`Added ${returnedPerson.name}`);
          setTimeout(() => {
            setNotification(null);
          }, 2500);
      })
      .catch((error) => {
        console.error("Error adding contact:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter search={search} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addContact={addContact}
      />
      <h3>Numbers</h3>
      <PersonList persons={filteredPersons} search={search} />
    </div>
  );
};

export default App;
