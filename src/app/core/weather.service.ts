import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from './config';
import { DayForecast } from './models/day-forecast';
import { WeatherConditions } from './models/weather-conditions';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    private weatherConditionsByZipCache = new Map<number, WeatherConditions>();
    private dayForecastByZipCache = new Map<number, DayForecast>();

    constructor(private httpClient: HttpClient) {}

    public getWeatherConditionsByZip = (zip: number): Observable<WeatherConditions> => {
        if (this.weatherConditionsByZipCache.has(zip)) {
            return of(this.weatherConditionsByZipCache.get(zip) as WeatherConditions);
        }

        const uri = `${config.BASE_WEATHER_URL}weather?zip=${zip}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;
        return this.httpClient
            .get<WeatherConditions>(uri)
            .pipe(tap((wc) => this.weatherConditionsByZipCache.set(zip, wc)));
    };

    public getDayForecastByZip = (zip: number, days: number): Observable<DayForecast> => {
        if (this.dayForecastByZipCache.has(zip)) {
            return of(this.dayForecastByZipCache.get(zip) as DayForecast);
        }

        const uri = `${config.BASE_WEATHER_URL}forecast/daily?zip=${zip}&cnt=${days}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;
        return this.httpClient
            .get<DayForecast>(uri)
            .pipe(tap((df) => this.dayForecastByZipCache.set(zip, df)));
    };
}
