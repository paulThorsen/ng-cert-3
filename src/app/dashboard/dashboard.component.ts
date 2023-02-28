import { Component } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { WeatherConditionsFromZip } from '../core/models/weather-conditions';
import { WeatherService } from '../core/weather.service';
import { ZipCodeService } from '../core/zip-code.service';

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
    public zipCodeWeatherConditions$: Observable<WeatherConditionsFromZip[]> = this.zipCodes$.pipe(
        switchMap((zipCodes) =>
            !zipCodes.length
                ? of([])
                : forkJoin(
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
