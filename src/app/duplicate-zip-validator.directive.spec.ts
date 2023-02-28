import { FormControl } from '@angular/forms';
import { MockZipCodeService } from './core/testing/mock-classes';
import { mockZip } from './core/testing/mock-data/mock-data';
import { ZipCodeService } from './core/zip-code.service';
import { DuplicateZipValidatorDirective } from './duplicate-zip-validator.directive';

describe('DuplicateZipValidatorDirective', () => {
    const directive = new DuplicateZipValidatorDirective(
        new MockZipCodeService() as unknown as ZipCodeService
    );

    it('creates an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('returns errors if validating a duplicate zip code from ZipCodeService', () => {
        let res;
        directive.validate(new FormControl(mockZip)).subscribe((result) => (res = result));
        expect(res).toEqual({ duplicateZip: true } as any);
    });

    it('returns null if validating a non-duplicate zip code', () => {
        let res;
        directive.validate(new FormControl('23443')).subscribe((result) => (res = result));
        expect(res).toBe(null as any);
    });
});
