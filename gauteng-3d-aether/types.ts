export interface WeatherData {
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  description: string;
  sources: { uri: string; title: string }[];
}

export enum WeatherStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}