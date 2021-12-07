import anecdoteService from '../services/anecdotes'

export const voteOf = (id) => {  
  return async dispatch => {
    const anecdote = await anecdoteService.getOne(id)
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const updatedAnectode = await anecdoteService.addVote(changedAnecdote)
    dispatch({
      type: 'VOTE',
      data: updatedAnectode
    })
  }
}

export const create = (data) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(data)
    dispatch({
      type: 'CREATE',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE':
      const id = action.data.id 
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : action.data)
    case 'CREATE':
      return [...state, action.data]
    case 'INIT_ANECDOTES':
      return action.data
    default: return state
  }

}

export default reducer