import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a typeahead option (`value`) into an HTML string that encloses the matching substring (`match`) in a `<strong>` element.
 */

@Pipe({
    standalone: true,
    name: 'typeaheadMatch',
})
export class TypeaheadMatchPipe implements PipeTransform {
    transform(value: string, match: string): string {
        if (match === '') return value;
        const sections = value.toLowerCase().split(match.toLowerCase());
        // Return HTML from substrings based on what matched
        return (
            value.substring(0, sections[0].length) +
            '<strong>' +
            value.substring(sections[0].length, sections[0].length + match.length) +
            '</strong>' +
            value.substring(sections[0].length + match.length)
        );
    }
}
