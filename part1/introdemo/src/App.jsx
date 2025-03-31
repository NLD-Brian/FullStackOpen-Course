import { useState } from 'react'
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
        <div>
          the app is used by pressing the buttons
        </div>
    )
  }
  return (
      <div>button press history: {props.allClicks.join('')}
      </div>
  )
}

const Button = (props) => {
  console.log(props)
  const {onClick, text} = props
  return(
  <button onClick={onClick}>
    {text}
  </button>
  )
}

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
    setRight(updatedRight)
    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right' />
      {right}
      <p>{allClicks.join(' ')}</p>
      <p>total: {total}</p>
      <History allClicks={allClicks} />
    </div>
  )
}

  export default App

  // import { useState } from 'react'

// const App = () => {
//   const [ counter, setCounter ] = useState(0)
//   console.log('Rendering with counter value', counter)

//   const increaseByOne = () => {
//     console.log('Increasing, value before', counter)
//     setCounter(counter + 1)
//   }
//   const decreaseByOne = () => {
//     console.log('Decreasing, value before', counter)
//     setCounter(counter - 1)
//   }

//   const setToZero = () => {
//     console.log('resetting to zoro, value before', counter)
//     setCounter(0)
//   }

//   return (
//     <div>
//       <Display counter={counter} />
//       <Button 
//         onClick={increaseByOne}
//         text='plus'
//       />
//       <Button
//         onClick={decreaseByOne}
//         text='minus'
//       />
//       <Button
//         onClick={setToZero}
//         text='reset'
//       /> 
//     </div>
//   )
// }

// const Display = ({ counter }) => <div>{counter}</div>

// const Button = ({ onClick, text}) => {
//   return (
//     <button onClick={onClick}>
//       {text}
//     </button>
//   )
// }

// export default App