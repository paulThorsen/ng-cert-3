import { TestBed } from '@angular/core/testing';
import { config } from '../config';
import { mockZip } from '../testing/mock-data/mock-data';
import { ZipCodeService } from './zip-code.service';

describe('ZipCodeService', () => {
    let service: ZipCodeService;
    let localStorageSetItemSpy: jasmine.Spy;
    let localStorageGetItemSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        localStorageSetItemSpy = spyOn(localStorage, 'setItem');
        // Mock localStorage response - start with one zip code in localStorage
        localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(
            JSON.stringify([mockZip])
        );
        service = TestBed.inject(ZipCodeService);
    });

    it('creates', () => {
        expect(service).toBeTruthy();
    });

    it('returns zip codes as an observable', () => {
        let zipCodes!: string[];
        service.getZipCodesSubjectAsObservable().subscribe((zips) => (zipCodes = zips));
        expect(zipCodes).toEqual([mockZip]);
    });

    it('calls localStorage.setItem() with appended zip code and emits new array of zip codes (from localStorage) via the subject', () => {
        const newZip = '75248';
        let zipCodes!: string[];
        service.getZipCodesSubjectAsObservable().subscribe((zips) => (zipCodes = zips));
        expect(zipCodes).toEqual([mockZip]);
        // Mock next call to getItem. Will include both zip codes
        localStorageGetItemSpy.and.returnValue(JSON.stringify([mockZip, newZip]));
        service.addZipCode(newZip);
        expect(localStorageGetItemSpy).toHaveBeenCalled();
        expect(localStorageSetItemSpy).toHaveBeenCalledWith(
            config.ZIP_CODES_LOCAL_STORAGE_KEY,
            JSON.stringify([mockZip, newZip])
        );
        expect(zipCodes).toEqual([mockZip, newZip]);
    });

    it('calls localStorage.setItem() without specified zip code and emits new array of zip codes (from localStorage) via the subject', () => {
        let zipCodes!: string[];
        service.getZipCodesSubjectAsObservable().subscribe((zips) => (zipCodes = zips));
        expect(zipCodes).toEqual([mockZip]);
        // Mock next call to getItem. Will include no zip codes
        localStorageGetItemSpy.and.returnValue(JSON.stringify([]));
        service.removeZipCode(mockZip);
        expect(localStorageGetItemSpy).toHaveBeenCalled();
        expect(localStorageSetItemSpy).toHaveBeenCalledWith(
            config.ZIP_CODES_LOCAL_STORAGE_KEY,
            JSON.stringify([])
        );
        expect(zipCodes).toEqual([]);
    });
});
