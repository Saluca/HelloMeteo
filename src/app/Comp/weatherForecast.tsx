"use client";

import React, { useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";

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
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="Enter a City"
        />
        <button onClick={handleSearch} style={{ marginLeft: 8 }}>
          Search City
        </button>
      </div>

      <h1>Forecast for {location}</h1>

      {loading && <p>Loading...</p>}

      {currentForecast.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h2>Current</h2>
          <p>Time: {currentForecast[0].time}</p>
          <p>Temp: {currentForecast[0].temp}°C</p>
          <p>Wind: {currentForecast[0].wind} km/h</p>
          <p>Humidity: {currentForecast[0].humidity}%</p>
          <p>Rain: {currentForecast[0].rain}mm</p>
        </div>
      )}

      {hourlyForecast.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <h2>Hourly</h2>
          <ul>
            {hourlyForecast.slice(0, 12).map((f, idx) => (
              <li key={idx}>
                {f.time} — Temp: {f.temp}°C, Wind: {f.wind} km/h, Humidity:{" "}
                {f.humidity}%, Rain: {f.rain}mm
              </li>
            ))}
          </ul>
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
