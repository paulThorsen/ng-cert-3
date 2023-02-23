import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { click, expectNoEl, findEl, findEls } from '../core/testing/element.spec-helper';
import { MockWeatherService, MockZipCodeService } from '../core/testing/mock-classes';
import { mockDallasWeather } from '../core/testing/mock-data/mock-dallas-weather';
import { mockMultipleZipCodes, mockZip } from '../core/testing/mock-data/mock-data';
import { mockProvoWeather } from '../core/testing/mock-data/mock-provo-weather';
import { WeatherService } from '../core/weather.service';
import { ZipCodeService } from '../core/zip-code.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let weatherServiceSpy: jasmine.Spy;
    let zipCodeService: MockZipCodeService;
    const cityWeather = [mockProvoWeather, mockDallasWeather];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule],
            declarations: [DashboardComponent],
            providers: [
                { provide: WeatherService, useClass: MockWeatherService },
                { provide: ZipCodeService, useClass: MockZipCodeService },
            ],
        }).compileComponents();

        // Mock calls for two zip codes
        weatherServiceSpy = spyOn(
            TestBed.inject(WeatherService),
            'getWeatherConditionsByZip'
        ).and.returnValues(...cityWeather.map((cityWeather) => of(cityWeather)));

        zipCodeService = TestBed.inject(ZipCodeService) as unknown as MockZipCodeService;
        fixture = TestBed.createComponent(DashboardComponent);
        fixture.detectChanges();
    });

    it('displays a weather row for each zip code from ZipCodeService', () => {
        expect(findEls(fixture, 'weatherRow').length).toBe(mockMultipleZipCodes.length);
    });

    it('displays the correct name and zip for each zip code', () => {
        findEls(fixture, 'name').forEach((nameEl, i) => {
            expect(nameEl.nativeElement.innerText).toContain(cityWeather[i].name);
            expect(nameEl.nativeElement.innerText).toContain(mockMultipleZipCodes[i]);
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
        zipCodeService.emitNewZipCodes([mockZip]);
        const iconEl = findEl(fixture, 'icon');
        expect(iconEl).toBeTruthy();
        expect(iconEl.attributes['src']).toBe(
            `/assets/weather-icons/${mockDallasWeather.weather[0].main.toLowerCase()}.png`
        );
    });

    it("doesn't display an icon image if unavailable", () => {
        // mockProvoWeather has weather condition (Mist) that we don't have an icon for
        weatherServiceSpy.and.returnValue(of(mockProvoWeather));
        zipCodeService.emitNewZipCodes([mockZip]);
        fixture.detectChanges();
        expectNoEl(fixture, 'icon');
    });

    it('calls `zipCodeService.removeZipCode()` when the close button is clicked', () => {
        const removeZipCodeSpy = spyOn(
            TestBed.inject(ZipCodeService) as unknown as MockZipCodeService,
            'removeZipCode'
        );
        click(fixture, 'removeZipButton');
        expect(removeZipCodeSpy).toHaveBeenCalledWith(mockZip);
    });
});
