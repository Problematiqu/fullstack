import React from 'react'

const Header = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    )
  }
  
  const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map(part => <Part key={part.id} part={part} />)}
      </div>
    )
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
    return (
        <p><b>total of {total} exercises</b></p>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total parts={course.parts} />
      </div>
      
    )
  
  }

  export default Course