import { Observable, of } from 'rxjs';
import { DayForecast } from '../models/day-forecast';
import { WeatherConditions } from '../models/weather-conditions';
import { WeatherService } from '../weather.service';
import { ZipCodeService } from '../zip-code.service';
import { mockProvo5DayForecast } from './mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from './mock-data/mock-provo-weather';

export class MockWeatherService
    implements Pick<WeatherService, 'getDayForecastByZip' | 'getWeatherConditionsByZip'>
{
    public getWeatherConditionsByZip = (zip: number): Observable<WeatherConditions> =>
        of(mockProvoWeather);
    public getDayForecastByZip = (zip: number, days: number): Observable<DayForecast> =>
        of(mockProvo5DayForecast);
}

export class MockZipCodeService
    implements
        Pick<ZipCodeService, 'addZipCode' | 'removeZipCode' | 'getZipCodesSubjectAsObservable'>
{
    public addZipCode = (zipCode: number) => {};
    public removeZipCode = (zipCode: number) => {};
    public getZipCodesSubjectAsObservable = (): Observable<number[]> => of([0]);
}
