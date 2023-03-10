import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expectText, findEl, findEls } from '../core/testing/element.spec-helper';
import { mockLocation } from '../core/testing/mock-data/mock-data';
import { mockProvo5DayForecast } from '../core/testing/mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from '../core/testing/mock-data/mock-provo-weather';
import { weatherServiceSpy } from '../core/testing/spies';
import { WeatherService } from '../core/services/weather.service';
import { ForecastComponent } from './forecast.component';
import { WeatherImageComponent } from '../core/components/weather-image/weather-image.component';

describe('ForecastComponent', () => {
    let fixture: ComponentFixture<ForecastComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, WeatherImageComponent],
            declarations: [ForecastComponent],
            providers: [
                { provide: WeatherService, useValue: weatherServiceSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(convertToParamMap({ zip: mockLocation.zipCode })),
                        queryParamMap: of(convertToParamMap({ country: mockLocation.country })),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ForecastComponent);
        fixture.detectChanges();
    });

    it('displays the city name and zip code', () => {
        expectText(fixture, 'header', ` ${mockProvoWeather.name} (${mockLocation.zipCode}) `);
    });

    it('displays the correct icon image for available weather types', () => {
        const availableIconWeatherTypes = ['snow', 'clear', 'rain', 'clouds'];
        // Filter out days we don't have icons for
        const daysIncludingIcons = mockProvo5DayForecast.list.filter((dayForecast) =>
            availableIconWeatherTypes.includes(dayForecast.weather[0].main.toLowerCase())
        );
        const iconEls = findEls(fixture, 'weatherImage');
        expect(iconEls.length).toBe(daysIncludingIcons.length);
        // Ensure the src links point to the correct icons
        iconEls.forEach((iconEl, i) =>
            expect(iconEl.nativeElement.src.includes(daysIncludingIcons[i].weather[0].main))
        );
    });

    it('displays a "Back" button that links back to the dashboard', () => {
        expect(findEl(fixture, 'back').attributes['href']).toBe('/');
    });
});
