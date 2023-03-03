import { TestBed } from '@angular/core/testing';
import { config } from '../config';
import { mockLocation } from '../testing/mock-data/mock-data';
import { Location, LocationService } from './location.service';

describe('LocationService', () => {
    let service: LocationService;
    let localStorageSetItemSpy: jasmine.Spy;
    let localStorageGetItemSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        localStorageSetItemSpy = spyOn(localStorage, 'setItem');
        // Mock localStorage response - start with one zip code in localStorage
        localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify([mockLocation])
        );
        service = TestBed.inject(LocationService);
    });

    it('creates', () => {
        expect(service).toBeTruthy();
    });

    it('returns locations as an observable', () => {
        let locations!: Location[];
        service.getLocationsSubjectAsObservable().subscribe((zips) => (locations = zips));
        expect(locations).toEqual([mockLocation]);
    });

    it('calls localStorage.setItem() with appended location and emits new array of locations (from localStorage) via the subject', () => {
        const newLocation = { zipCode: '75248', country: 'United States' };
        let locations!: Location[];
        service.getLocationsSubjectAsObservable().subscribe((zips) => (locations = zips));
        expect(locations).toEqual([mockLocation]);
        // Mock next call to getItem. Will include both zip codes
        localStorageGetItemSpy.and.returnValue(JSON.stringify([mockLocation, newLocation]));
        service.addLocation(newLocation.zipCode, newLocation.country);
        expect(localStorageGetItemSpy).toHaveBeenCalled();
        expect(localStorageSetItemSpy).toHaveBeenCalledWith(
            config.ZIP_CODES_LOCAL_STORAGE_KEY,
            JSON.stringify([mockLocation, newLocation])
        );
        expect(locations).toEqual([mockLocation, newLocation]);
    });

    it('calls localStorage.setItem() without specified zip code and emits new array of zip codes (from localStorage) via the subject', () => {
        let locations!: Location[];
        service.getLocationsSubjectAsObservable().subscribe((zips) => (locations = zips));
        expect(locations).toEqual([mockLocation]);
        // Mock next call to getItem. Will include no zip codes
        localStorageGetItemSpy.and.returnValue(JSON.stringify([]));
        service.removeLocation(mockLocation);
        expect(localStorageGetItemSpy).toHaveBeenCalled();
        expect(localStorageSetItemSpy).toHaveBeenCalledWith(
            config.ZIP_CODES_LOCAL_STORAGE_KEY,
            JSON.stringify([])
        );
        expect(locations).toEqual([]);
    });
});
