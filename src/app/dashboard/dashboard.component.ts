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
    isLoading = false;
    errorText = '';
    zipCodeInput = '';

    zipCodeWeatherConditions$: Observable<WeatherConditionsFromZip[]> = this.zipCodes
        .getZipCodesSubjectAsObservable()
        .pipe(
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

    public addLocation = (zipCode: string): void => {
        this.errorText = '';
        if (zipCode.length !== 5) {
            this.errorText = 'Please enter a 5 digit zip code';
            return;
        }
        this.isLoading = true;
        this.weather.getWeatherConditionsByZip(zipCode).subscribe({
            next: () => {
                this.zipCodes.addZipCode(zipCode);
                this.isLoading = false;
                this.zipCodeInput = '';
            },
            error: () => {
                this.errorText =
                    'Could not find data for zipcode ' + zipCode + '. Please try another zipcode.';
                this.isLoading = false;
            },
        });
    };

    public removeLocation = (zipCode: string): void => {
        this.zipCodes.removeZipCode(zipCode);
    };
}
