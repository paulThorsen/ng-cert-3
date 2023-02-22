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

    public getWeatherConditionsByZip = (zipCode: number): Observable<any> => {
        if (this.weatherConditionsByZipCache.has(zipCode)) {
            return of(this.weatherConditionsByZipCache.get(zipCode));
        }

        const uri = `${config.BASE_WEATHER_URL}weather?zip=${zipCode}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;

        return this.httpClient.get<WeatherConditions>(uri).pipe(
            tap((wc) => this.weatherConditionsByZipCache.set(zipCode, wc)),
            catchError((err, caught) => {
                return of(null);
            })
        );
    };

    public getDayForecaseByZip = (
        zipCode: number,
        days: number
    ): Observable<DayForecast | null> => {
        if (this.dayForecastByZipCache.has(zipCode)) {
            return of(this.dayForecastByZipCache.get(zipCode) as DayForecast);
        }

        const uri = `${config.BASE_WEATHER_URL}forecast/daily?zip=${zipCode}&cnt=${days}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;

        return this.httpClient.get<DayForecast>(uri).pipe(
            tap((df) => this.dayForecastByZipCache.set(zipCode, df)),
            catchError((err, caught) => {
                return of(null);
            })
        );
    };
}
