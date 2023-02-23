import { BehaviorSubject, Observable, of } from 'rxjs';
import { DayForecast } from '../models/day-forecast';
import { WeatherConditions } from '../models/weather-conditions';
import { WeatherService } from '../weather.service';
import { ZipCodeService } from '../zip-code.service';
import { mockMultipleZipCodes } from './mock-data/mock-data';
import { mockProvo5DayForecast } from './mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from './mock-data/mock-provo-weather';

export class MockWeatherService
    implements Pick<WeatherService, 'getDayForecastByZip' | 'getWeatherConditionsByZip'>
{
    public getWeatherConditionsByZip = (zip: string): Observable<WeatherConditions> =>
        of(mockProvoWeather);
    public getDayForecastByZip = (zip: string, days: number): Observable<DayForecast> =>
        of(mockProvo5DayForecast);
}

export class MockZipCodeService
    implements
        Pick<ZipCodeService, 'addZipCode' | 'removeZipCode' | 'getZipCodesSubjectAsObservable'>
{
    private zipCodesSubject = new BehaviorSubject<string[]>(mockMultipleZipCodes);
    public addZipCode = (zipCode: string) => {};
    public removeZipCode = (zipCode: string) => {};
    public getZipCodesSubjectAsObservable = (): Observable<string[]> =>
        this.zipCodesSubject.asObservable();
    public emitNewZipCodes = (zipCodes: string[]) => this.zipCodesSubject.next(zipCodes);
}
