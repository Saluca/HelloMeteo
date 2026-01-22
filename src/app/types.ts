export interface Forecast {
  label: string | number | null | undefined;
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
