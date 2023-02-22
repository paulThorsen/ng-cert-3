import { Component } from '@angular/core';
import { forkJoin, iif, Observable, of } from 'rxjs';
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

    zipCodeWeatherConditions$: Observable<WeatherConditionsFromZip[]> = this.zipCodeManager
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

    constructor(private weather: WeatherService, private zipCodeManager: ZipCodeService) {}

    public addLocation = (zipCode: number): void => {
        this.errorText = '';
        if (zipCode <= 9999 || zipCode > 99999) {
            this.errorText = 'Please enter a 5 digit zip code';
            return;
        }
        this.isLoading = true;
        this.weather.getWeatherConditionsByZip(zipCode).subscribe({
            next: () => {
                this.zipCodeManager.addZipCode(zipCode);
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

    public removeLocation = (zipCode: number): void => {
        this.zipCodeManager.removeZipCode(zipCode);
    };
}
