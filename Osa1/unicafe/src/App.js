import React, { useState} from "react"

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({text, value}) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  )
}
  
const Statistics = ({ good, neutral, bad })  => {
  if (good + neutral + bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )

  }
  return (
    <>
      <table>
        <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={good + neutral + bad} />
        <StatisticLine text='average' value={(good - bad) / (good + neutral + bad)} />     
        <StatisticLine text='positive' value={(good / (good + neutral + bad) * 100) + ' %'} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)

  const handleNeutral = () => setNeutral(neutral + 1)

  const handleBad = () => setBad(bad + 1)

  
  return (
    <div>
      <h1>Give feedback</h1>
      <br/>
      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />
      <br/>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
