import React, { useEffect, useState } from "react";
import axios from "axios";
import AllWeather from "./AllWeather";

const OneCountryDisplay = ({ result }) => {
  const keys = Object.keys(result.languages);
  const [allWeather, setAllWeather] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_SOME_KEY;
    axios
      .get(
        `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${result.capital[0]}&aqi=no`
      )
      .then((response) => {
        setAllWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error.message);
      });
  }, [result.capital]); // Include result.capital as a dependency to re-fetch weather data when capital changes

  return (
    <div>
      <div>
        <h1>{result.name.common}</h1>
        <p>{result.capital[0]}</p>
        <p>{result.area}</p>
        <h3>languages:</h3>
        <ul>
          {keys.map((key) => (
            <li key={key}>{result.languages[key]}</li>
          ))}
        </ul>
        <img src={result.flags.png} alt="flag" height="200" width="250" />
      </div>
      {allWeather && <AllWeather weatherData={allWeather} />}
    </div>
  );
};

export default OneCountryDisplay;
