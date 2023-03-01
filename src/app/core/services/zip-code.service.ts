import { Injectable } from '@angular/core';
import { BehaviorSubject as BehaviorSubject, Observable } from 'rxjs';
import { config } from '../config';

@Injectable({
    providedIn: 'root',
})
export class ZipCodeService {
    /**
     * Returns zip codes from local storage.
     *
     * @returns zip codes from localStorage
     */
    private getZipCodesFromLocalStorage = (): string[] =>
        JSON.parse(localStorage.getItem(config.ZIP_CODES_LOCAL_STORAGE_KEY) ?? '[]');

    private zipCodesSubject = new BehaviorSubject<string[]>(this.getZipCodesFromLocalStorage());
    public getZipCodesSubjectAsObservable = (): Observable<string[]> =>
        this.zipCodesSubject.asObservable();

    /**
     * Adds a zip code to the current array of codes, then calls `setZipCodes()`.
     *
     * @param zipCode zip code to add
     */
    public addZipCode = (zipCode: string): void => {
        let updatedZipCodes = [...this.zipCodesSubject.value];
        updatedZipCodes.push(zipCode);
        this.setZipCodes(updatedZipCodes);
    };

    /**
     * Removes a zip code from the current array of codes in localStorage and saved them.
     */
    public removeZipCode = (zipCode: string): void => {
        let updatedZipCodes = this.zipCodesSubject.value.filter((zip) => zip !== zipCode);
        this.setZipCodes(updatedZipCodes);
    };

    /**
     * Emits zip codes from localStorage via `zipCodesSubject`.
     */
    private emitZipCodes = (): void => {
        const zipCodes = this.getZipCodesFromLocalStorage();
        this.zipCodesSubject.next(zipCodes);
    };

    /**
     * Adds zip codes to `localStorage`, then calls `getZipCodes()`.
     */
    private setZipCodes = (zipCodes: string[]): void => {
        localStorage.setItem(config.ZIP_CODES_LOCAL_STORAGE_KEY, JSON.stringify(zipCodes));
        this.emitZipCodes();
    };
}
