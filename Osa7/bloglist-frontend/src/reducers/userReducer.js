export const logUser = (user) => {
  return async dispatch => {
    dispatch({
      type: 'LOG_USER',
      data: user
    })
  }
}

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'LOG_USER':
    return action.data
  default:
    return state
  }
}

export default userReducer