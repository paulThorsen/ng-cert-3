import { Injectable } from '@angular/core';
import { BehaviorSubject as BehaviorSubject, Observable } from 'rxjs';
import { config } from '../config';

export interface Location {
    zipCode: string;
    country: string;
}

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    /**
     * Returns locations from local storage.
     *
     * @returns {Location[]} locations from localStorage
     */
    private getLocationsFromLocalStorage = (): Location[] =>
        JSON.parse(localStorage.getItem(config.ZIP_CODES_LOCAL_STORAGE_KEY) ?? '[]');

    private locationsSubject = new BehaviorSubject<Location[]>(this.getLocationsFromLocalStorage());
    public getLocationsSubjectAsObservable = (): Observable<Location[]> =>
        this.locationsSubject.asObservable();

    /**
     * Adds a location to the current array of codes, then calls `setLocations()`.
     *
     * @param zipCode zip code of location
     * @param country country of location
     */
    public addLocation = (zipCode: string, country: string): void => {
        let updatedZipCodes = [...this.locationsSubject.value];
        updatedZipCodes.push({ zipCode, country });
        this.setLocations(updatedZipCodes);
    };

    /**
     * Removes a location from the current array of codes in localStorage and saved them.
     */
    public removeLocation = (location: Location): void => {
        let updatedLocations = this.locationsSubject.value.filter(
            (loc) => loc.zipCode !== location.zipCode || loc.country !== location.country
        );
        this.setLocations(updatedLocations);
    };

    /**
     * Emits locations from localStorage via `locationsSubject`.
     */
    private emitLocations = (): void => {
        const locations = this.getLocationsFromLocalStorage();
        this.locationsSubject.next(locations);
    };

    /**
     * Adds locations to `localStorage`, then calls `getLocations()`.
     */
    private setLocations = (locations: Location[]): void => {
        localStorage.setItem(config.ZIP_CODES_LOCAL_STORAGE_KEY, JSON.stringify(locations));
        this.emitLocations();
    };
}
