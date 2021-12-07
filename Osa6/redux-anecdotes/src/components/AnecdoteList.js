import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteOf } from '../reducers/anecdoteReducer'
import { createNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const ascending = (a, b) => {
    return b.votes - a.votes
  }
    
  const originalAnecdotes = useSelector(state => state.anecdotes.sort(ascending))
  const filter = useSelector(state => state.filter)
  const anecdotes = originalAnecdotes.filter(anecdote => anecdote.content.includes(filter))
  const dispatch = useDispatch()

  const vote = (id, content) => {
    dispatch(voteOf(id))
    dispatch(createNotification(`you voted ${content}`, 5))
  }

  return(
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList