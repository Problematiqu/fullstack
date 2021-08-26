import React, { useEffect, useState } from 'react' 
import axios from 'axios'

const Search = ({ word, change }) => {
  return (
  <div>
    find countries <input
      value={word}
      onChange={change}/>
  </div>
  )
}

const DisplayAllCountries = ({ countries, searchword }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>    
  }  else if (countries.length > 1 && countries.length <= 10) {
    return (
      <div>
        {countries.map(country => <DisplayCountryList key={country.name} country={country} searchword={searchword} />)}
      </div>
    )
  }  else if (countries.length === 1) {
      return <div><DisplayCountry country={countries[0]} /></div>
  } else {
    return <div> </div>
  }
}

const DisplayCountryList = ({ country, searchword }) => {
  return (
  <p> {country.name} <ShowButton country={country} searchword={searchword} /></p>
  )
}

const DisplayCountry = ({ country }) => {

  const [weather, setWeather] = useState({})
  
  useEffect(() => {
    const api_key = process.env.REACT_APP_API_KEY
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country])
  
  if (weather.request === undefined) {
    return <div> </div>
  } else {
    return <CountryInfo country={country} weather={weather}/>
  }
}

const CountryInfo = ({country, weather}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>{country.languages.map(language => <li key={language.name}>{language.name}</li>)}</ul>
      <img src={country.flag} width="100" height="70" alt="Flag of the country"/>
      <h2>weather in {country.capital}</h2>
      <p><b>temperature:</b> {weather.current.temperature} Celsius </p>
      <img src={weather.current.weather_icons[0]} width="50" height="35" alt="Weather"/>
      <p><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
    </div>
  )
}

const ShowButton = ({ country, searchword }) => {

  const showCountry = (event) => {
    event.preventDefault()
    searchword(country.name)
  }

  return <button onClick={showCountry}> show </button>
}
  
const App = () => {
  const [countries, setCountries] = useState([])
  const [searchword, setSearchword] = useState('')
  
  useEffect(() => {
    axios 
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  
  const handleSearchChange = (event) => {
    setSearchword(event.target.value)
  }

  const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(searchword.toLowerCase()))

  return (
    <div>
      <Search word={searchword} change={handleSearchChange}/>
      <DisplayAllCountries countries={filteredCountries} searchword={setSearchword}/>
    </div>
  )
}

export default App;
