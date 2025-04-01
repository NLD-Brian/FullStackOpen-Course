const Course = ({ course }) => {
  console.log(course);
  const totalExercises = course.parts.reduce((sum, part) => {
    console.log("Parameters are", sum, part);
    return sum + part.exercises;
  }, 0);
  return (
    <div>
      <h1>{course.name}</h1>
      <ul>
        {course.parts.map((part) => (
          <li key={part.id}>
            {part.name} {part.exercises}
          </li>
        ))}
      </ul>

      <p>Total number of exercises: {totalExercises}</p>
    </div>
  );
};

export default Course;
