import { Component } from '@angular/core';
import { forkJoin, Observable, of, timer } from 'rxjs';
import { delay, filter, map, repeat, switchMap, withLatestFrom } from 'rxjs/operators';
import { WeatherConditionsFromZip } from '../core/models/weather-conditions';
import { WeatherService } from '../core/services/weather.service';
import { ZipCodeService } from '../core/services/zip-code.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    public isLoading = false;
    public isSubmitted = false;
    public zipHasNoWeather = false;
    public zipCodeInput = '';

    public zipCodes$ = this.zipCodes.getZipCodesSubjectAsObservable();
    public weatherConditionsRefreshTimer$ = this.zipCodes$.pipe(
        switchMap((zipCodes) => (zipCodes.length ? timer(0, 30000) : of(-1)))
    );
    public zipCodeWeatherConditions$ = this.weatherConditionsRefreshTimer$.pipe(
        withLatestFrom(this.zipCodes$),
        switchMap(([timer, zipCodes]: [number, string[]]) =>
            timer >= 0
                ? forkJoin(
                      zipCodes.map((zip) =>
                          this.weather.getWeatherConditionsByZip(zip).pipe(
                              // Convert WeatherConditions to WeatherConditionsFromZip
                              map((weather): WeatherConditionsFromZip => {
                                  return {
                                      zipCode: zip,
                                      conditions: weather,
                                  };
                              })
                          )
                      )
                  )
                : of([])
        )
    );

    constructor(private weather: WeatherService, private zipCodes: ZipCodeService) {}

    public addLocation = (zipCode: string, isFormValid: boolean): void => {
        this.isSubmitted = true;
        this.zipHasNoWeather = false;
        if (isFormValid) {
            this.isLoading = true;
            this.weather.getWeatherConditionsByZip(zipCode).subscribe({
                next: () => {
                    this.zipCodes.addZipCode(zipCode);
                    this.zipCodeInput = '';
                    this.isSubmitted = false;
                    this.isLoading = false;
                },
                error: () => {
                    this.zipHasNoWeather = true;
                    this.isLoading = false;
                },
            });
        }
    };

    public removeLocation = (zipCode: string): void => {
        this.zipCodes.removeZipCode(zipCode);
    };
}
