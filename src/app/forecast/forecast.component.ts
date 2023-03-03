import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share, switchMap, withLatestFrom } from 'rxjs/operators';
import { config } from '../core/config';
import { countriesMap } from '../core/countries';
import { DayForecast } from '../core/models/day-forecast';
import { WeatherService } from '../core/services/weather.service';

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
    constructor(private route: ActivatedRoute, private weather: WeatherService) {}

    zipCode$: Observable<string> = this.route.paramMap.pipe(
        map((paramMap) => paramMap.get('zip') || '')
    );

    country$: Observable<string> = this.route.queryParamMap.pipe(
        map((queryParamMap) => queryParamMap.get('country') ?? 'United States')
    );

    weatherConditionsForZip$: Observable<DayForecast | null> = this.zipCode$.pipe(
        withLatestFrom(this.country$),
        switchMap(([zipCode, country]) =>
            this.weather.getDayForecastByZip(
                zipCode,
                countriesMap.get(country) as string,
                config.FORECASTED_DAYS
            )
        ),
        share()
    );
}
