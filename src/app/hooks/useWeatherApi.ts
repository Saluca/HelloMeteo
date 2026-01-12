import axios from "axios";
import { useEffect, useState } from "react";
import { Forecast, DailyForecast } from "../types";

export const useWeatherApi = ({ location }: { location: string }) => {
  const [currentForecast, setCurrentForecast] = useState<Forecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<Forecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  //   const [searchLocation, setSearchLocation] = useState<string>("London");
  //   const [location, setLocation] = useState<string>("London");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        const geolocationResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`
        );
        if (!geolocationResponse.data.results?.length) {
          setError("Location not found");
          setLoading(false);
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

        const hourlyForecast: Forecast[] = fetchedData.hourly.time.map(
          (time: string, i: number) => ({
            time: time,
            temp: fetchedData.hourly.temperature_2m[i],
            wind: fetchedData.hourly.wind_speed_10m[i],
            humidity: fetchedData.hourly.relative_humidity_2m[i],
            rain: fetchedData.hourly.rain[i],
          })
        );
        setHourlyForecast(hourlyForecast);

        const currentHour = new Date().getHours();
        const next12Hours = hourlyForecast // want to see forecast from current hour onwards
          .filter(
            (forecast) => new Date(forecast.time).getHours() >= currentHour
          )
          .slice(0, 13);

        // setSearchTime(now.toISOString());
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
    fetchWeatherForecast();
  }, [location]);

  return {
    error,
    loading,
    currentForecast,
    hourlyForecast,
    dailyForecast,
  };
};
