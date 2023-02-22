import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { findEl } from './core/testing/element.spec-helper';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
    });

    it('creates the app', () => {
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it('contains a router outlet', () => {
        expect(findEl(fixture, 'outlet')).toBeTruthy();
    });
});
