import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { config } from './config';

@Injectable({
    providedIn: 'root',
})
export class ZipCodeService {
    private zipCodesSubject = new BehaviorSubject<string[]>([]);

    constructor() {
        this.getZipCodes();
    }

    public getZipCodesSubjectAsObservable = (): Observable<string[]> =>
        this.zipCodesSubject.asObservable();

    /**
     * Adds a zip code to the current array of codes, then calls `setZipCodes()`
     *
     * @param zipCode zip code to add
     */
    public addZipCode = (zipCode: string): void => {
        let updatedZipCodes = [...this.zipCodesSubject.value];
        updatedZipCodes.push(zipCode);
        this.setZipCodes(updatedZipCodes);
    };

    /**
     * Removes a zip code from the current array of codes, then calls `setZipCodes()`
     *
     * @param zipCode zip code to add
     */
    public removeZipCode = (zipCode: string): void => {
        let updatedZipCodes = this.zipCodesSubject.value.filter((zip) => zip !== zipCode);
        this.setZipCodes(updatedZipCodes);
    };

    /**
     * Get zip codes from `localStorage`, then emits them via `zipCodesSubject`
     * @returns zip code array from `localStorage`
     */
    private getZipCodes = (): void => {
        const zipCodes = JSON.parse(
            localStorage.getItem(config.ZIP_CODES_LOCAL_STORAGE_KEY) ?? '[]'
        );
        this.zipCodesSubject.next(zipCodes);
    };

    /**
     * Adds zip codes to `localStorage`, the calls `getZipCodes()`
     * @param zipCodes zip code array to save to `localStorage`
     */
    private setZipCodes = (zipCodes: string[]): void => {
        localStorage.setItem(config.ZIP_CODES_LOCAL_STORAGE_KEY, JSON.stringify(zipCodes));
        this.getZipCodes();
    };
}
