import { Component } from '@angular/core';
import { BehaviorSubject, forkJoin, interval, of, timer } from 'rxjs';
import { catchError, delay, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ButtonState } from '../core/components/multi-state-button/multi-state-button.component';
import { countriesMap } from '../core/countries';
import { WeatherConditionsFromZip } from '../core/models/weather-conditions';
import { WeatherService } from '../core/services/weather.service';
import { Location, LocationService } from '../core/services/location.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    public submitStateSubject = new BehaviorSubject<ButtonState>('default');

    public isSubmitted = false;
    public zipHasNoWeather = false;
    public zipCodeInput = '';
    public countryValue = 'United States';
    public countries = Array.from(countriesMap.keys());

    public locations$ = this.location.getLocationsSubjectAsObservable();
    public weatherConditionsRefreshTimer$ = this.locations$.pipe(
        // Return -1 to indicate no zip codes
        switchMap((locations) => (locations.length ? interval(30000).pipe(startWith(0)) : of(-1)))
    );
    public zipCodeWeatherConditions$ = this.weatherConditionsRefreshTimer$.pipe(
        withLatestFrom(this.locations$),
        switchMap(([timer, locations]: [number, Location[]]) =>
            // -1 indicates no zip codes
            timer >= 0
                ? forkJoin(
                      locations.map((location) =>
                          this.weather
                              .getWeatherConditionsByZip(
                                  location.zipCode,
                                  // Pull from zip code object
                                  countriesMap.get(location.country) as string
                              )
                              .pipe(
                                  // Convert WeatherConditions to WeatherConditionsFromZip
                                  map((weather): WeatherConditionsFromZip => {
                                      return {
                                          location: location,
                                          conditions: weather,
                                      };
                                  })
                              )
                      )
                  )
                : of([])
        )
    );

    constructor(private weather: WeatherService, private location: LocationService) {}

    public addLocation = (zipCode: string, isFormValid: boolean): void => {
        this.isSubmitted = true;
        this.zipHasNoWeather = false;
        if (isFormValid && this.countryValue) {
            this.submitStateSubject.next('loading');
            this.weather
                .getWeatherConditionsByZip(zipCode, countriesMap.get(this.countryValue) as string)
                .pipe(
                    tap(() => {
                        this.location.addLocation(zipCode, this.countryValue);
                        this.zipCodeInput = '';
                        this.isSubmitted = false;
                        this.submitStateSubject.next('complete');
                    }),
                    delay(1000),
                    tap(() => this.submitStateSubject.next('default')),
                    catchError((e) => {
                        this.zipHasNoWeather = true;
                        this.submitStateSubject.next('default');
                        return of(e);
                    })
                )
                .subscribe();
        }
    };

    public removeLocation = (location: Location): void => {
        this.location.removeLocation(location);
    };
}
