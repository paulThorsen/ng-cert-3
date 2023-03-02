import { Component } from '@angular/core';
import { BehaviorSubject, forkJoin, interval, of } from 'rxjs';
import { catchError, delay, map, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { ButtonState } from '../core/components/button/multi-state-button.component';
import { WeatherConditionsFromZip } from '../core/models/weather-conditions';
import { WeatherService } from '../core/services/weather.service';
import { ZipCodeService } from '../core/services/zip-code.service';

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

    public zipCodes$ = this.zipCodes.getZipCodesSubjectAsObservable();
    public weatherConditionsRefreshTimer$ = this.zipCodes$.pipe(
        // Return -1 to indicate no zip codes
        switchMap((zipCodes) => (zipCodes.length ? interval(30000).pipe(startWith(0)) : of(-1)))
    );
    public zipCodeWeatherConditions$ = this.weatherConditionsRefreshTimer$.pipe(
        withLatestFrom(this.zipCodes$),
        switchMap(([timer, zipCodes]: [number, string[]]) =>
            // -1 indicates no zip codes
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
            this.submitStateSubject.next('loading');
            this.weather
                .getWeatherConditionsByZip(zipCode)
                .pipe(
                    tap(() => {
                        this.zipCodes.addZipCode(zipCode);
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

    public removeLocation = (zipCode: string): void => {
        this.zipCodes.removeZipCode(zipCode);
    };
}
