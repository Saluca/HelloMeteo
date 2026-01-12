"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DailyForecast, Forecast } from "../types";

const Weather = () => {
  const [searchTime, setSearchTime] = useState<string>("");
  const [currentForecast, setCurrentForecast] = useState<Forecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<Forecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<string>("London");
  const [location, setLocation] = useState<string>("London");
  const fetchWeatherForecast = async () => {
    setLoading(true);
    try {
      const geolocationResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`
      );
      if (!geolocationResponse.data.results?.length) {
        throw new Error("Location not found");
      } // if results exist return their length
      // console.log(geolocationResponse)
      const { latitude: lat, longitude: lon } =
        geolocationResponse.data.results[0]; // get lat and lon from first returned obj
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,wind_speed_10m,relative_humidity_2m,rain&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_mean&timezone=auto`
      );
      const fetchedData = weatherResponse.data;
      console.log(fetchedData);
      setCurrentForecast([fetchedData.current_weather]); //current weather

      const hourly: Forecast[] = fetchedData.hourly.time.map(
        (time: string, i: number) => ({
          time: time,
          temp: fetchedData.hourly.temperature_2m[i],
          wind: fetchedData.hourly.wind_speed_10m[i],
          humidity: fetchedData.hourly.relative_humidity_2m[i],
          rain: fetchedData.hourly.rain[i],
        })
      );
      setHourlyForecast(hourly);

      const now = new Date();
      const currentHour = now.getHours();
      const next12Hours = hourly // want to see forecast from current hour onwards
        .filter((f) => new Date(f.time).getHours() >= currentHour)
        .slice(0, 12);

      setSearchTime(now.toISOString());
      const currentWeather = next12Hours[0];
      //hourly.reduce((prev, curr) => {
      //   const currDate = new Date(curr.time);
      //   return Math.abs(currDate.getTime() - now.getTime()) <
      //     Math.abs(new Date(prev.time).getTime() - now.getTime())
      //     ? curr
      //     : prev;
      // });
      setCurrentForecast([currentWeather]); // So that current weather now actually displays values
      setHourlyForecast(next12Hours);

      const daily: DailyForecast[] = fetchedData.daily.time.map(
        (date: string, i: number) => ({
          date,
          tempMax: fetchedData.daily.temperature_2m_max[i],
          tempMin: fetchedData.daily.temperature_2m_min[i],
          weathercode: fetchedData.daily.weathercode[i],
          precipitationProb:
            fetchedData.daily.precipitation_probability_mean[i],
        })
      );
      setDailyForecast(daily);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeatherForecast();
  }, [location]);

  const handleSearch = () => {
    setLocation(searchLocation);
  };

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
