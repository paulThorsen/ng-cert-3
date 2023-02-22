import { Observable, of } from 'rxjs';
import { DayForecast } from '../models/day-forecast';
import { WeatherConditions } from '../models/weather-conditions';
import { WeatherService } from '../weather.service';
import { mockProvo5DayForecast } from './mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from './mock-data/mock-provo-weather';

export class MockWeatherService implements Partial<WeatherService> {
    public getWeatherConditionsByZip = (zip: number): Observable<WeatherConditions> =>
        of(mockProvoWeather);
    public getDayForecastByZip = (zip: number, days: number): Observable<DayForecast> =>
        of(mockProvo5DayForecast);
}
