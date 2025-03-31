import { useState } from 'react'

const Statistics = (props) => {
  if (props.all === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <Statistic text="Good" value={props.good} />
          <Statistic text="Neutral" value={props.neutral} />
          <Statistic text="Bad" value={props.bad} />
          <Statistic text="All" value={props.all} />
          <Statistic text="Average" value={props.all !== 0 ? props.average : 0} />
          <Statistic text="Positive" value={props.all !== 0 ? props.positive : 0} />
          <Statistic text="Negative" value={props.negative} />
        </tbody>
      </table>
    </div>
  )
}

const Statistic = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{text === "Positive" || text === "Negative" ? `${value} %` : value}</td>
    </tr>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodHandler = () => {
    setGood(good + 1)
  }
  const neutralHandler = () => {
    setNeutral(neutral + 1)
  }
  const badHandler = () => {
    setBad(bad + 1)
  }
  const all = good + neutral + bad
  const average = (good - bad) / all
  const averageRounded = Math.round(average * 10) / 10
  const positive = (good / all) * 100
  const positiveRounded = Math.round(positive * 10) / 10
  const negative = (bad / all) * 100
  const negativeRounded = Math.round(negative * 10) / 10

  return (
    <div>
      <h1>Feedback Provider</h1>
      <button onClick={goodHandler}>Good</button>
      <button onClick={neutralHandler}>Neutral</button>
      <button onClick={badHandler}>Bad</button>

      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={averageRounded} positive={positiveRounded} negative={negativeRounded} />
    </div>
  )
}

export default App