import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherApiKey = '' // Add your OpenWeatherMap API key here 
const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&units=metric`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeatherForCountry = () => {
    const request = axios.get(weatherApiUrl)
    return request.then(response => response.data)
}


export default {
    getAll: getAll,
    getWeatherForCountry: getWeatherForCountry
}