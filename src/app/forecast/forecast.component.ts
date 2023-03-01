import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { config } from '../core/config';
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

    weatherConditionsForZip$: Observable<DayForecast | null> = this.zipCode$.pipe(
        switchMap((zipCode) => this.weather.getDayForecastByZip(zipCode, config.FORECASTED_DAYS)),
        share()
    );
}
