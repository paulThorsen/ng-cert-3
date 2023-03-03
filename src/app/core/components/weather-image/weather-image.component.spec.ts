import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherImageComponent } from './weather-image.component';

describe('WeatherImageComponent', () => {
    let component: WeatherImageComponent;
    let fixture: ComponentFixture<WeatherImageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WeatherImageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(WeatherImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
