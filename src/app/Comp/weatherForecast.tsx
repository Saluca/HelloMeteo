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
  IconSearch,
} from "@tabler/icons-react";

const Weather = () => {
  const [searchLocation, setSearchLocation] = useState("LONDON");
  const [location, setLocation] = useState("LONDON");

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
    <main className="page">
      <section className="search-container">
        <input
          className="input"
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          // placeholder="Enter a City"
        />
        <button onClick={handleSearch} className="search-button">
          <span className="search-icon">
            <IconSearch size={10} />
          </span>
          Search
        </button>
        {/* <h1>Forecast for {location}</h1> */}
      </section>

      {currentForecast.length > 0 && (
        <>
          <section className="currentCard">
            <section className="current">
              <h1>{location}</h1>
              {/* <p>Time: {currentForecast[0].time}</p> */}
              <span className="currentTemp">
                <IconTemperature size={30} /> {currentForecast[0].temp}°C
              </span>
            </section>

            <section className="currentDetails">
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
            </section>
          </section>
        </>
      )}

      {hourlyForecast.length > 0 && (
        <>
          <section className="hourlyWrapper">
            <section className="hourlyTitle">
              <h2>Hourly Forecast (Next 12 Hours)</h2>
            </section>
            <section className="hourlyCard" role="list">
              {hourlyForecast.slice(0, 12).map((f) => (
                <section key={f.label} className="hourlyItem">
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
                </section>
              ))}
            </section>
          </section>
        </>
      )}

      {dailyForecast.length > 0 && (
        <>
          <section className="dailyWrapper">
            <section className="dailyTitle">
              <h2>Daily Forecast (Next 7 Days)</h2>
            </section>

            <section className="dailyCard" role="list">
              {dailyForecast.map((d) => (
                <section key={d.label} className="dailyItem">
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
                </section>
              ))}
            </section>
          </section>
        </>
      )}
    </main>
  );
};

export default Weather;
