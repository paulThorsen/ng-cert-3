import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expectText, findEl, findEls } from '../core/testing/element.spec-helper';
import { MockWeatherService } from '../core/testing/mock-classes';
import { mockZip } from '../core/testing/mock-data/mock-data';
import { mockProvo5DayForecast } from '../core/testing/mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from '../core/testing/mock-data/mock-provo-weather';
import { WeatherService } from '../core/weather.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [DashboardComponent],
            providers: [{ provide: WeatherService, useClass: MockWeatherService }],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        fixture.detectChanges();
    });
});
