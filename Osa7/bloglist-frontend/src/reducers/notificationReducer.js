let timeoutID = ''

const notificationReducer = (state = '', action) => {
  switch (action.type) {
  case 'CREATE_NOTIFICATION':
    return action.message
  case 'CLEAR_NOTIFICATION':
    return ''
  default:
    return state
  }
}

export const createNotification = (message, time) => {
  return async dispatch => {
    dispatch({
      type: 'CREATE_NOTIFICATION',
      message
    })
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'CLEAR_NOTIFICATION'
      })
    }, time * 1000)
  }
}

export default notificationReducer