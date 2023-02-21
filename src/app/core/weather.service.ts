import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DayForecast } from './models/day-forecast';
import { WeatherConditions } from './models/weather-conditions';

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/';
const UNIT_TYPE = 'imperial';

// In real life this is a bad idea. Secrets should be secret. YOLO for the API key.
const API_KEY = '5a4b2d457ecbef9eb2a71e480b947604';

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

        const uri = `${BASE_WEATHER_URL}weather?zip=${zipCode}&units=${UNIT_TYPE}&appid=${API_KEY}`;

        return this.httpClient.get<WeatherConditions>(uri).pipe(
            tap((wc) => this.weatherConditionsByZipCache.set(zipCode, wc)),
            catchError((err, caught) => {
                console.log(err, caught);
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

        const uri = `${BASE_WEATHER_URL}forecast/daily?zip=${zipCode}&cnt=${days}&units=${UNIT_TYPE}&appid=${API_KEY}`;

        return this.httpClient.get<DayForecast>(uri).pipe(
            tap((df) => this.dayForecastByZipCache.set(zipCode, df)),
            catchError((err, caught) => {
                console.log(err, caught);
                return of(null);
            })
        );
    };
}
