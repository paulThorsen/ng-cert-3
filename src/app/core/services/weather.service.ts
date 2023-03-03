import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';
import { DayForecast } from '../models/day-forecast';
import { WeatherConditions } from '../models/weather-conditions';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    constructor(private httpClient: HttpClient) {}

    public getWeatherConditionsByZip = (
        zip: string,
        countryCode: string
    ): Observable<WeatherConditions> => {
        const uri = `${config.BASE_WEATHER_URL}weather?zip=${zip},${countryCode}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;
        return this.httpClient.get<WeatherConditions>(uri);
    };

    public getDayForecastByZip = (
        zip: string,
        countryCode: string,
        days: number
    ): Observable<DayForecast> => {
        const uri = `${config.BASE_WEATHER_URL}forecast/daily?zip=${zip},${countryCode}&cnt=${days}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;
        return this.httpClient.get<DayForecast>(uri);
    };
}
