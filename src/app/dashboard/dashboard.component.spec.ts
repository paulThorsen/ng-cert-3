import {
    ComponentFixture,
    discardPeriodicTasks,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { delay, of, tap } from 'rxjs';
import {
    click,
    expectNoEl,
    expectText,
    findEl,
    findEls,
    setFieldValue,
} from '../core/testing/element.spec-helper';
import { MockWeatherService, MockLocationService } from '../core/testing/mock-classes';
import { mockDallasWeather } from '../core/testing/mock-data/mock-dallas-weather';
import { mockMultipleLocations, mockLocation } from '../core/testing/mock-data/mock-data';
import { mockProvoWeather } from '../core/testing/mock-data/mock-provo-weather';
import { WeatherService } from '../core/services/weather.service';
import { DashboardComponent } from './dashboard.component';
import { LocationService } from '../core/services/location.service';
import { TypeaheadComponent } from '../core/components/typeahead/typeahead.component';
import { MultiStateButtonComponent } from '../core/components/multi-state-button/multi-state-button.component';
import { countriesMap } from '../core/countries';

describe('DashboardComponent', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let weatherServiceSpy: jasmine.Spy;
    let locationService: MockLocationService;
    const cityWeather = [mockProvoWeather, mockDallasWeather];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                FormsModule,
                TypeaheadComponent,
                MultiStateButtonComponent,
            ],
            declarations: [DashboardComponent],
            providers: [
                { provide: WeatherService, useClass: MockWeatherService },
                { provide: LocationService, useClass: MockLocationService },
            ],
        }).compileComponents();

        // Mock calls for two zip codes
        weatherServiceSpy = spyOn(
            TestBed.inject(WeatherService),
            'getWeatherConditionsByZip'
        ).and.returnValues(...cityWeather.map((cityWeather) => of(cityWeather)));

        locationService = TestBed.inject(LocationService) as unknown as MockLocationService;
        fixture = TestBed.createComponent(DashboardComponent);
        fixture.detectChanges();
    });

    it('displays a weather row for each zip code from ZipCodeService', () => {
        expect(findEls(fixture, 'weatherRow').length).toBe(mockMultipleLocations.length);
    });

    it('displays the correct name and zip for each zip code', () => {
        findEls(fixture, 'name').forEach((nameEl, i) => {
            expect(nameEl.nativeElement.innerText).toContain(cityWeather[i].name);
            expect(nameEl.nativeElement.innerText).toContain(mockMultipleLocations[i].zipCode);
        });
    });

    it('displays the correct weather conditions for each zip code', () => {
        findEls(fixture, 'conditions').forEach((conditionEl, i) =>
            expect(conditionEl.nativeElement.innerText).toContain(cityWeather[i].weather[0].main)
        );
    });

    it('displays the correct temperatures for each zip code', () => {
        findEls(fixture, 'temperatures').forEach((temperatureEl, i) => {
            expect(temperatureEl.nativeElement.innerText).toContain(cityWeather[i].main.temp);
            expect(temperatureEl.nativeElement.innerText).toContain(cityWeather[i].main.temp_max);
            expect(temperatureEl.nativeElement.innerText).toContain(cityWeather[i].main.temp_min);
        });
    });

    it('displays the correct icon image if available', () => {
        weatherServiceSpy.and.returnValue(of(mockDallasWeather));
        locationService.emitNewLocations([mockLocation]);
        const iconEl = findEl(fixture, 'icon');
        expect(iconEl).toBeTruthy();
        expect(iconEl.attributes['src']).toBe(
            `/assets/weather-icons/${mockDallasWeather.weather[0].main.toLowerCase()}.png`
        );
    });

    it("doesn't display an icon image if unavailable", () => {
        // mockProvoWeather has weather condition (Mist) that we don't have an icon for
        weatherServiceSpy.and.returnValue(of(mockProvoWeather));
        locationService.emitNewLocations([mockLocation]);
        fixture.detectChanges();
        expectNoEl(fixture, 'icon');
    });

    it('calls `LocationService.removeLocation()` with the location when the close button is clicked', () => {
        const removeLocationSpy = spyOn(
            TestBed.inject(LocationService) as unknown as MockLocationService,
            'removeLocation'
        );
        click(fixture, 'removeZipButton');
        expect(removeLocationSpy).toHaveBeenCalledWith(mockLocation);
    });

    it('calls `LocationService.addLocation()` with the new location when the user enters a zip code and clicks add location (if the zip code returns weather)', fakeAsync(() => {
        const addLocationSpy = spyOn(
            TestBed.inject(LocationService) as unknown as MockLocationService,
            'addLocation'
        );
        weatherServiceSpy.and.returnValue(of(mockProvoWeather));
        setFieldValue(fixture, 'zipInput', mockLocation.zipCode);
        fixture.detectChanges();
        click(fixture, 'multiStageButton');
        fixture.detectChanges();
        // All calls have completed. Assert below
        expect(addLocationSpy).toHaveBeenCalledWith(mockLocation.zipCode, mockLocation.country);
        expect(weatherServiceSpy).toHaveBeenCalledWith(
            mockLocation.zipCode,
            countriesMap.get(mockLocation.country) as string
        );
        // Wait for stable before testing template forms
        // See: https://stackoverflow.com/a/49665237/11790081
        fixture.whenStable().then(() => {
            expect(findEl(fixture, 'zipInput').nativeElement.value).toBe('');
        });
        discardPeriodicTasks();
    }));

    it("displays badZipError and doesn't call `zipCodeService.addZipCode()` if the zip code doesn't return weather when the add location button is clicked", fakeAsync(() => {
        const addZipCodeSpy = spyOn(
            TestBed.inject(LocationService) as unknown as MockLocationService,
            'addLocation'
        );
        weatherServiceSpy.and.returnValue(
            of(null).pipe(
                tap(() => {
                    // Simulate no weather returned
                    throw new Error();
                })
            )
        );
        setFieldValue(fixture, 'zipInput', mockLocation.zipCode);
        fixture.detectChanges();
        click(fixture, 'multiStageButton');
        fixture.detectChanges();
        fixture.detectChanges();
        // All calls have completed. Assert below
        expectText(
            fixture,
            'badZipError',
            `Could not find data for zipcode ${mockLocation.zipCode}. Please try another zipcode.`
        );
        expect(addZipCodeSpy).not.toHaveBeenCalled();
        fixture.whenStable().then(() => {
            expect(findEl(fixture, 'zipInput').nativeElement.value).toBe(mockLocation);
        });
    }));

    // it("refreshes each zip code's weather conditions every 30 seconds", fakeAsync(() => {}));
});
