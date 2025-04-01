import phonebookService from "../services/phonebook";
const PersonList = ({ persons }) => {
  const handleDelete = (person) =>
  {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService.remove(person.id)
    }
  };

return (
    <ul>
      {persons.map((person) => (
        <li key={person.id}>
          {person.name} - {person.number}
          <button onClick={() => handleDelete(person)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default PersonList;
