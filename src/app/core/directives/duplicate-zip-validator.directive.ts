import { Directive, forwardRef } from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    NG_ASYNC_VALIDATORS,
    ValidationErrors,
} from '@angular/forms';
import { catchError, first, map, Observable, of } from 'rxjs';
import { ZipCodeService } from '../services/zip-code.service';

@Directive({
    selector: '[appDuplicateZipValidator]',
    providers: [
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => DuplicateZipValidatorDirective),
            multi: true,
        },
    ],
})
export class DuplicateZipValidatorDirective implements AsyncValidator {
    constructor(private zipCodes: ZipCodeService) {}
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.zipCodes.getZipCodesSubjectAsObservable().pipe(
            first(),
            map((zipCodes) => (zipCodes.includes(control.value) ? { duplicateZip: true } : null)),
            catchError(() => of(null))
        );
    }
}
