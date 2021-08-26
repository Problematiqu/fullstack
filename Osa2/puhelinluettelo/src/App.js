import React, { useEffect, useState } from 'react'
import communication from './services/communication.js'

const DisplayAll = ({ persons, setter }) => {
  return persons.map(person => <DisplayPerson key={person.name} person={person} setter={setter} />)
}

const DisplayPerson = ({ person, setter }) => {

  return <p>{person.name} {person.number} <button onClick={() => setter(person)}>delete</button></p>
}

const Filter = ({ filter, filterchange} ) => {
  return (
    <div>
      filter shown with <input
        value={filter}
        onChange={filterchange} 
      />
    </div>
  )
}

const Form = ({submit, name, namechange, number, numberchange}) => {
  return (
    <form onSubmit={submit}>
      <div>
        name: <input 
          value={name}
          onChange={namechange} 
        />
      </div>
      <div>
        number: <input 
          value={number}
          onChange={numberchange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='message'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName ] = useState('')
  const [newNumber, setNewNumber ] = useState('')
  const [newFilter, setNewFilter ] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    communication 
      .getAll() 
      .then(receivedPersons => {
        setPersons(receivedPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const nameAlreadyExists = persons.some(person => person.name === newName)
    const toBeAdded = {name: newName, number: newNumber}

    if (nameAlreadyExists) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const existing = persons.find(person => person.name === newName)
        communication
          .update(existing.id, toBeAdded)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${updatedPerson.name}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${toBeAdded.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existing.id))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {         
      communication 
        .create(toBeAdded)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${addedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = event => {    
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
    setNewFilter(event.target.value)
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      communication 
        .remove(person)
        .then(() => {
          setPersons(persons.filter(per => per.id !== person.id))
          setMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)          
        })
    }
  }

  const filteredPersons = persons.filter(person => {
    const lowercase = person.name.toLowerCase()
    return (lowercase.includes(newFilter)
  )})

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <ErrorNotification message={errorMessage}/>
      <Filter filter={newFilter} filterchange={handleFilterChange} />
      <h3>add a new</h3>
      <Form submit={addPerson} name={newName} namechange={handleNameChange} number={newNumber} numberchange={handleNumberChange}/>
      <h3>Numbers</h3>
      <DisplayAll persons={filteredPersons} setter={handleDelete} />
    </div>
  )

}

export default App