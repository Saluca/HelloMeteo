"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";

interface CurrentForecast {
  time: string;
  temp: number;
  wind: number;
  humidity: number;
} // defining object shape TS style, Pascal case
interface HourlyForecast {
  time: string;
  temp: number;
  wind: number;
  humidity: number;
  rain: number;
}
interface HourlyData {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  rain: number[];
}
interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
  precipitationProb: number;
}
interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_probability_mean: number[];
}
interface ForecastResponse {
  current_weather: CurrentForecast;
  hourly: HourlyData;
  daily: DailyData;
}

const Weather = () => {
  const [currentForecast, setCurrentForecast] =
    useState<CurrentForecast | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
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
      setCurrentForecast(fetchedData.current_weather); //current weather

      const hourly: HourlyForecast[] = fetchedData.hourly.time.map(
        (time: string, i: number) => ({
          time: time,
          temp: fetchedData.hourly.temperature_2m[i],
          wind: fetchedData.hourly.wind_speed_10m[i],
          humidity: fetchedData.hourly.relative_humidity_2m[i],
          rain: fetchedData.hourly.rain[i],
        })
      );
      setHourlyForecast(hourly);

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
    // ...existing code...

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

      {currentForecast && (
        <div style={{ marginBottom: 12 }}>
          <h2>Current</h2>
          <p>Time: {currentForecast.time}</p>
          <p>Temp: {currentForecast.temp}°C</p>
          <p>Wind: {currentForecast.wind} km/h</p>
          <p>Humidity: {currentForecast.humidity}%</p>
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
