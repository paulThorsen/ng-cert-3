export interface DayForecast {
    cod: string;
    message: number;
    cnt: number;
    list: Forecast[];
    city: City;
}

export interface City {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
}

export interface Forecast {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: Temperature;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    weather: Weather[];
    speed: number;
    deg: number;
    gust: number;
    clouds: number;
    pop: number;
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface FeelsLike {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

export interface Temperature {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}
