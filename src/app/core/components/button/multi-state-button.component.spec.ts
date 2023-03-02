import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiStateButtonComponent } from './multi-state-button.component';

describe('ButtonComponent', () => {
    let component: MultiStateButtonComponent;
    let fixture: ComponentFixture<MultiStateButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultiStateButtonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MultiStateButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
