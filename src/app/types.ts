export interface CurrentForecast {
  time: string;
  temp: number;
  wind: number;
  humidity: number;
  rain: number;
} // defining object shape TS style, Pascal case

export interface HourlyForecast {
  time: string;
  temp: number;
  wind: number;
  humidity: number;
  rain: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
  precipitationProb: number;
}
