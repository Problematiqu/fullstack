import React, { useState } from 'react'

const Button = ({ handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Title = ({ title }) => (
  <h1>{title}</h1>
)

const Anecdote = ({ anecdotes, selected, votes }) => {
  return(
    <>
      {anecdotes[selected]}
      <br/>
      has {votes} votes
    </>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(new Array(anecdotes.length).fill(0))

  const handleSelected = () => (
    setSelected(Math.floor(Math.random() * anecdotes.length))
  )

  const handleVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVote(copy)
  }

  const order = [...votes]
  order.sort(function(a, b) {
    return a - b
  })
  
  const mostvoted = (votes.findIndex(number => number === order[order.length -1]))

  return (
    <div>
      <Title title='Anecdote of the day' />
      <Anecdote anecdotes={anecdotes} selected={selected} votes={votes[selected]} />
      <br/>
      <Button handleClick={handleVote} text='vote' />
      <Button handleClick={handleSelected} text='next anecdote' /> 
      <br/>
      <Title title='Anecdote with most votes' />
      <Anecdote anecdotes={anecdotes} selected={mostvoted} votes={votes[mostvoted]} />
    </div>
  )
}

export default App