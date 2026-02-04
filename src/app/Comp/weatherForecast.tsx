"use client";

import React, { useState } from "react";
import { useWeatherApi } from "../hooks/useWeatherApi";
import "./search.css";
import "./weatherDisplay.css";
import "./page.css";
import {
  IconTemperaturePlusFilled,
  IconTemperatureMinusFilled,
  IconTemperature,
  IconWind,
  IconDropletHalf2Filled,
  IconUmbrella,
} from "@tabler/icons-react";

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
        onChange={(e) => setSearchLocation(e.target.value.toUpperCase())}
        placeholder="Enter a City"
      />
      <button onClick={handleSearch} className="search-button">
        Search City
      </button>
      {/* <h1>Forecast for {location}</h1> */}

      {currentForecast.length > 0 && (
        <>
          <div className="currentCard">
            <div className="current">
              <h1>{location}</h1>
              {/* <p>Time: {currentForecast[0].time}</p> */}
              <span className="currentTemp">
                <IconTemperature size={30} /> {currentForecast[0].temp}°C
              </span>
            </div>

            <div className="currentDetails">
              <span>
                <IconWind size={16} /> {currentForecast[0].wind} km/h
              </span>
              <span>
                <IconDropletHalf2Filled size={16} />
                {currentForecast[0].humidity}%
              </span>
              <span>
                <IconUmbrella size={16} /> {currentForecast[0].rain}mm
              </span>
            </div>
          </div>
        </>
      )}

      {hourlyForecast.length > 0 && (
        <>
          <div className="hourlyWrapper">
            <div className="hourlyTitle">
              <h2>Hourly Forecast (Next 12 Hours)</h2>
            </div>
            <div className="hourlyCard" role="list">
              {hourlyForecast.slice(0, 12).map((f) => (
                <div key={f.label} className="hourlyItem">
                  <time dateTime={f.time} className="hour">
                    {f.label}
                  </time>
                  <span className="hourlyStat">
                    <IconTemperature size={16} /> {Number(f.temp).toFixed(1)}°C
                  </span>
                  <span className="hourlyStat">
                    <IconWind size={16} /> {Number(f.wind).toFixed(1)} km/h
                  </span>
                  <span className="hourlyStat">
                    <IconDropletHalf2Filled size={16} />{" "}
                    {Number(f.humidity).toFixed(1)}%
                  </span>
                  <span className="hourlyStat">
                    <IconUmbrella size={16} /> {Number(f.rain).toFixed(1)} mm
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {dailyForecast.length > 0 && (
        <>
          <div className="dailyWrapper">
            <div className="dailyTitle">
              <h2>Daily Forecast (Next 7 Days)</h2>
            </div>

            <div className="dailyCard" role="list">
              {dailyForecast.map((d) => (
                <div key={d.label} className="dailyItem">
                  <time dateTime={d.date} className="day">
                    {d.label}
                  </time>
                  <span className="dailyStat">
                    <IconTemperaturePlusFilled size={16} />
                    {d.tempMax}°C
                  </span>
                  <span className="dailyStat">
                    <IconTemperatureMinusFilled size={16} /> {d.tempMin}°C
                  </span>
                  <span className="dailyStat">
                    <IconUmbrella size={16} /> {d.precipitationProb}%
                  </span>

                  {/* <span className="dailyStat"> 🌀 {d.weathercode}</span> */}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
