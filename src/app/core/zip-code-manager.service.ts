import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const ZIP_CODES_LOCAL_STORAGE_KEY = 'weatherZipCodes';

@Injectable()
export class ZipCodeManagerService {
    private zipCodesCache: number[] = [];

    public addZipCode = (zipCode: number): Observable<number[]> => {
        let updatedZipCodes = [...this.zipCodesCache];
        updatedZipCodes.push(zipCode);
        console.log('adding zip ' + zipCode);
        return this.setZipCodes(updatedZipCodes);
    };

    public removeZipCode = (zipCode: number): Observable<number[]> => {
        let updatedZipCodes = this.zipCodesCache.filter((zip) => zip !== zipCode);
        return this.setZipCodes(updatedZipCodes);
    };

    /**
     * Get zipCodes from localStorage
     * @returns zipCodes array to save to localStorage
     */
    public getZipCodes = (): Observable<number[]> => {
        const zipCodes = JSON.parse(localStorage.getItem(ZIP_CODES_LOCAL_STORAGE_KEY) ?? '[]');
        this.zipCodesCache = zipCodes;
        return of(this.zipCodesCache);
    };

    /**
     * Add zipCodes to localStorage
     * @param zipCodes zipCodes array to save to localStorage
     */
    private setZipCodes = (zipCodes: number[]): Observable<number[]> => {
        console.log('setting codes ' + zipCodes);
        localStorage.setItem(ZIP_CODES_LOCAL_STORAGE_KEY, JSON.stringify(zipCodes));
        // this.zipCodesSubject.next(zipCodes);
        return this.getZipCodes();
    };
}
