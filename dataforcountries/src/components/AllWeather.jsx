import React, { useEffect, useState } from "react";
import axios from "axios";

const AllWeather = ({ result }) => {
  const [allWeather, setAllWeather] = useState(null);

  useEffect(() => {
    if (!result || !result.capital || result.capital.length === 0) {
      // If result or result.capital is undefined or an empty array, return early
      return;
    }

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
  }, [result]);

  if (
    !result ||
    !result.capital ||
    result.capital.length === 0 ||
    allWeather === null
  ) {
    // If result or result.capital is undefined or an empty array, or allWeather is null, return null
    return null;
  }

  return (
    <div>
      <h2>{`Weather in ${result.capital[0]}`}</h2>
      <p>{`Temperature: ${allWeather.current.temp_c.toFixed(2)} Celsius`}</p>
      <img
        alt="Weather icon"
        src={allWeather.current.condition.icon}
        width="50"
        height="50"
      />
      <p>{`Wind: ${allWeather.current.wind_kph} km/h`}</p>
    </div>
  );
};

export default AllWeather;
