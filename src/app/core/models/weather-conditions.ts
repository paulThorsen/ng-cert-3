import { Coordinates, Weather } from './day-forecast';

export interface WeatherConditions {
    coord: Coordinates;
    weather: Weather[];
    base: string;
    main: Conditions;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: SystemInfo;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export interface SystemInfo {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface Clouds {
    all: number;
}

export interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

export interface Conditions {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}
