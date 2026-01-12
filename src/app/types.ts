export interface CurrentForecast {
  time: string;
  temp: number;
  wind: number;
  humidity: number;
  rain: number;
} // defining object shape TS style, Pascal case

export interface CurrentForecastData {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  rain: number[];
}

export interface HourlyForecast {
  time: string;
  temp: number;
  wind: number;
  humidity: number;
  rain: number;
}

export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
  rain: number[];
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
  precipitationProb: number;
}

export interface DailyData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_probability_mean: number[];
}

export interface ForecastResponse {
  current_weather: CurrentForecastData;
  hourly: HourlyData;
  daily: DailyData;
}
