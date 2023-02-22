import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { share } from 'rxjs/operators';
import { config } from '../core/config';
import { DayForecast } from '../core/models/day-forecast';
import { WeatherService } from '../core/weather.service';

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent implements OnInit {
    zipCode: number | null = null;
    weatherConditionsForZip$: Observable<DayForecast | null> = of(null);

    constructor(private route: ActivatedRoute, private weather: WeatherService) {}

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const zipCode = parseInt(params.get('zipCode') as string);
            this.zipCode = zipCode;

            this.weatherConditionsForZip$ = this.weather
                .getDayForecaseByZip(zipCode, config.FORECASTED_DAYS)
                .pipe(share());
        });
    }
}
