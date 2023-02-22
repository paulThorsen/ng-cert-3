import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { combineAll, map, mergeAll, mergeMap, share, switchMap, tap } from 'rxjs/operators';
import { WeatherConditions } from '../core/models/weather-conditions';
import { WeatherService } from '../core/weather.service';
import { ZipCodeManagerService } from '../core/zip-code-manager.service';

interface WeatherConditionsFromZip {
    zipCode: number;
    conditions: WeatherConditions;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    zipCodeInput: number | null = null;
    zipCodeWeatherConditions$: Observable<WeatherConditionsFromZip[]> = of([]);

    set zipCodeWeatherConditionsObservable(obs: Observable<number[]>) {
        this.zipCodeWeatherConditions$ = obs.pipe(
            // Transform observable to Observable<WeatherConditionsFromZip[]>
            switchMap((zipCodes) => {
                // combineLatest doesn't emit if there are no inner observables that have emitted (no zipcodes, for example)
                if (!zipCodes.length) return of([]);
                // Need to get an observable for each zip code
                const arr = zipCodes.map((zip) =>
                    this.weather.getWeatherConditionsByZip(zip).pipe(
                        // Transform each observable to typeof WeatherConditionFromZip
                        switchMap((weather) => {
                            return of({
                                zipCode: zip,
                                conditions: weather,
                            } as WeatherConditionsFromZip);
                        })
                    )
                );
                // Combine array of observables to observable of array of values
                return combineLatest(arr);
            })
        );
    }

    showZipCodeHint = false;
    // Will be hidden if null
    errorText = '';
    isLoading = false;

    constructor(private weather: WeatherService, private zipCodeManager: ZipCodeManagerService) {}

    ngOnInit() {
        // Reactive programming - only subscription is in the template
        this.zipCodeWeatherConditionsObservable = this.zipCodeManager.getZipCodes();
    }

    public addLocation = (zipCode: number): void => {
        this.errorText = '';
        if (zipCode <= 9999 || zipCode > 99999) {
            this.showZipCodeHint = true;
            return;
        }
        this.showZipCodeHint = false;
        this.weather.getWeatherConditionsByZip(zipCode).subscribe((weather) => {
            if (weather) {
                // Only save zipcode if there was not an error.
                // Subscribe here because template won't be using this. The Subject emitted from the service will be subscribed to from the template
                this.zipCodeWeatherConditionsObservable = this.zipCodeManager.addZipCode(zipCode);
            } else {
                this.errorText =
                    'Could not find data for zipcode ' + zipCode + '. Please try another zipcode.';
            }
            this.isLoading = false;
        });
        this.zipCodeInput = null;
    };

    public removeLocation = (zipCode: number): void => {
        // Subscribe here because template won't be using this. The Subject emitted from the service will be subscribed to from the template
        this.zipCodeWeatherConditionsObservable = this.zipCodeManager.removeZipCode(zipCode);
    };
}
