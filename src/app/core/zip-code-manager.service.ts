import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { config } from './config';

@Injectable({
    providedIn: 'root',
})
export class ZipCodeManagerService {
    private zipCodesCache: number[] = [];

    public addZipCode = (zipCode: number): Observable<number[]> => {
        let updatedZipCodes = [...this.zipCodesCache];
        updatedZipCodes.push(zipCode);
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
        const zipCodes = JSON.parse(
            localStorage.getItem(config.ZIP_CODES_LOCAL_STORAGE_KEY) ?? '[]'
        );
        this.zipCodesCache = zipCodes;
        return of(this.zipCodesCache);
    };

    /**
     * Add zipCodes to localStorage
     * @param zipCodes zipCodes array to save to localStorage
     */
    private setZipCodes = (zipCodes: number[]): Observable<number[]> => {
        localStorage.setItem(config.ZIP_CODES_LOCAL_STORAGE_KEY, JSON.stringify(zipCodes));
        return this.getZipCodes();
    };
}
