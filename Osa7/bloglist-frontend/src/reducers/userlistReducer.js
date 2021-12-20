import userService from '../services/users'

export const initializeUsers = () => {
  return async dispatch => {
    const userlist = await userService.getAll()
    dispatch({
      type: 'INIT_USERLIST',
      data: userlist
    })
  }
}

const userlistReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERLIST':
    return action.data
  default: return state
  }
}

export default userlistReducer