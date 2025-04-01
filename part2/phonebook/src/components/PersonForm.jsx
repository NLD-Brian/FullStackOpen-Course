const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  addContact,
}) => {
  return (
    <div>
      <form>
        <div>
          <p>
            name: <input value={newName} onChange={handleNameChange} />
          </p>
          <p>
            number: <input value={newNumber} onChange={handleNumberChange} />
          </p>
        </div>
        <div>
          <button type="submit" onClick={addContact}>
            add
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonForm;
