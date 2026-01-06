"use client"

import React, { use, useEffect, useState } from "react";
import axios from "axios";

interface Forecast{
    hour:string;
    temp:number;
    wind:number;
    humidity:number;
}; // defining object shape TS style, Pascal case

const Weather =() => {
    const [forecast,setForecast] = useState<Forecast[]>([]) //only accept Forecat data and strts empty
    const [loading,setLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<string>('London');
    const [searchLocation,setSearchLocation] = useState<string>('London');
    const fetchWeatherForecast = async() =>{
        setLoading(true);
        try{
            const geolocationResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
            if (!geolocationResponse.data.results?.length) {
                 throw new Error("Location not found");
                    }; // if results exist return their length        
            console.log(geolocationResponse)
            const { latitude: lat, longitude: lon } = geolocationResponse.data.results[0]; // get lat and lon from first returned obj
            const weatherResponse =axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
            const destructuredData = (await weatherResponse).data;
            console.log(destructuredData)
            const hours = 24;
            const formattedData: Forecast[] = destructuredData.hourly.time.slice(0, hours).map((time: any, index: string | number) => ({
                hour: time,
                temp: destructuredData.hourly.temperature_2m[index],
                wind: destructuredData.hourly.wind_speed_10m[index],
                humidity: destructuredData.hourly.relative_humidity_2m[index],
                }));// formatted data from API
            setForecast(formattedData);
        } catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchWeatherForecast();
    },[location]);
    
    const handleSearch = () =>{
        setLocation(searchLocation);
    }

    return(
        <><><input
            type='text'
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Enter a City" />
            <button onClick={handleSearch}> Search City</button>
        </><div>
                <h1>Hourly Forecast for {location}</h1>
                <ul>
                    {forecast.map((f) => (
                        <li key={f.hour} style={{ marginBottom: "10px" }}>
                            <strong>{f.hour}</strong> — Temp: {f.temp}°C, Wind: {f.wind} km/h, Humidity: {f.humidity}%
                        </li>
                    ))}
                </ul>
            </div></>

         )
};
export default Weather