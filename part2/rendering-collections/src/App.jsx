import Note from './components/Note'

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        <Note key={note.id} note={note} /> // key is a special prop that React uses to identify which items have changed, are added, or are removed.
      )}
      </ul>
    </div>
  )
}

export default App