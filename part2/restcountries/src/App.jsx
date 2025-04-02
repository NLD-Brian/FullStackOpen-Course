import { useState, useEffect } from "react";
import countryService from "./services/countries";
import "./index.css";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

useEffect(() => {
    countryService
      .getAll()
      })
  }, []);

  if (!countries) {
    return null;
  }

  const displayCountries

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Add Note</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;
