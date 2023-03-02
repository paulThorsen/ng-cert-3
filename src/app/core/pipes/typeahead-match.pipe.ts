import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'typeaheadMatch',
})
export class TypeaheadMatchPipe implements PipeTransform {
    transform(value: string, match: string): string {
        if (match === '') return value;
        const sections = value.split(match);
        return `${sections[0]}<strong>${match}</strong>${sections[1]}`;
    }
}
