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

    public getWeatherConditionsByZip = (zip: string): Observable<WeatherConditions> => {
        const uri = `${config.BASE_WEATHER_URL}weather?zip=${zip}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;
        return this.httpClient.get<WeatherConditions>(uri);
    };

    public getDayForecastByZip = (zip: string, days: number): Observable<DayForecast> => {
        const uri = `${config.BASE_WEATHER_URL}forecast/daily?zip=${zip}&cnt=${days}&units=${config.UNIT_TYPE}&appid=${config.API_KEY}`;
        return this.httpClient.get<DayForecast>(uri);
    };
}
