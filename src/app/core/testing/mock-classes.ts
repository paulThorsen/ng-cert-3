import { BehaviorSubject, Observable, of } from 'rxjs';
import { DayForecast } from '../models/day-forecast';
import { WeatherConditions } from '../models/weather-conditions';
import { WeatherService } from '../services/weather.service';
import { Location, LocationService } from '../services/location.service';
import { mockMultipleLocations } from './mock-data/mock-data';
import { mockProvo5DayForecast } from './mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from './mock-data/mock-provo-weather';

export class MockWeatherService
    implements Pick<WeatherService, 'getDayForecastByZip' | 'getWeatherConditionsByZip'>
{
    public getWeatherConditionsByZip = (zip: string): Observable<WeatherConditions> =>
        of(mockProvoWeather);
    public getDayForecastByZip = (
        zip: string,
        country: string,
        days: number
    ): Observable<DayForecast> => of(mockProvo5DayForecast);
}

export class MockLocationService
    implements
        Pick<LocationService, 'addLocation' | 'removeLocation' | 'getLocationsSubjectAsObservable'>
{
    private locationsSubject = new BehaviorSubject<Location[]>(mockMultipleLocations);
    public addLocation = (zipCode: string, country: string) => {};
    public removeLocation = (location: Location) => {};
    public getLocationsSubjectAsObservable = (): Observable<Location[]> =>
        this.locationsSubject.asObservable();
    public emitNewLocations = (locations: Location[]) => this.locationsSubject.next(locations);
}
