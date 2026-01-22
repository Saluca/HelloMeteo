"use client";

import React, { useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import "./search.css";
import "./weatherDisplay.css";

const Weather = () => {
  const [searchLocation, setSearchLocation] = useState("London");
  const [location, setLocation] = useState("London");

  const { error, loading, dailyForecast, hourlyForecast, currentForecast } =
    useWeatherApi({
      location,
    });

  const handleSearch = () => {
    setLocation(searchLocation);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="page">
      <div className="search-container" />
      <input
        className="input"
        type="text"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        placeholder="Enter a City"
      />
      <button onClick={handleSearch} className="search-button">
        Search City
      </button>
      <h1>Forecast for {location}</h1>

      {currentForecast.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h2>Current</h2>
          {/* <p>Time: {currentForecast[0].time}</p> */}
          <p>Temp: {currentForecast[0].temp}°C</p>
          <p>Wind: {currentForecast[0].wind} km/h</p>
          <p>Humidity: {currentForecast[0].humidity}%</p>
          <p>Rain: {currentForecast[0].rain}mm</p>
        </div>
      )}

      {hourlyForecast.length > 0 && (
        <div className="hourly">
          <h2>Hourly</h2>
          {hourlyForecast.slice(0, 12).map((f, idx) => (
            <div key={f.label} className="hourlyItem">
              <time dateTime={f.time} className="hour">
                {f.label}
              </time>
              <span className="stat">🌡 {f.temp}°C</span>
              <span className="stat">🌬 {f.wind} km/h</span>
              <span className="stat">💧 {f.humidity}%</span>
              <span className="stat">🌧 {f.rain} mm</span>
            </div>
          ))}
        </div>
      )}

      {dailyForecast.length > 0 && (
        <div>
          <h2>Daily</h2>
          <ul>
            {dailyForecast.map((d, idx) => (
              <li key={idx}>
                {d.date} — Max: {d.tempMax}°C, Min: {d.tempMin}°C, Precip:{" "}
                {d.precipitationProb}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather;
