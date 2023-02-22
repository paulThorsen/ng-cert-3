import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { config } from '../core/config';
import { DayForecast } from '../core/models/day-forecast';
import { WeatherService } from '../core/weather.service';

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
    constructor(private route: ActivatedRoute, private weather: WeatherService) {}

    zipCode$: Observable<number> = this.route.paramMap.pipe(
        map((paramMap) => parseInt(paramMap.get('zip') || ''))
    );

    weatherConditionsForZip$: Observable<DayForecast | null> = this.zipCode$.pipe(
        switchMap((zipCode) =>
            this.weather.getDayForecaseByZip(zipCode, config.FORECASTED_DAYS).pipe(share())
        )
    );
}
