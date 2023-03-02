import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TypeaheadMatchPipe } from '../../pipes/typeahead-match.pipe';

@Component({
    selector: 'app-typeahead',
    standalone: true,
    imports: [CommonModule, FormsModule, TypeaheadMatchPipe],
    templateUrl: './typeahead.component.html',
    styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent implements OnInit {
    @Input() ariaLabel = 'input';
    @Input() id = '';
    @Input() placeholder = '';
    @Input() options: string[] = [];
    @Input() initValue = '';

    public showOptions = false;
    public inputValueSubject = new BehaviorSubject<string>('');
    public optionsDisplayed$: Observable<string[]> = this.inputValueSubject
        .asObservable()
        .pipe(
            map((val) =>
                this.options.filter((option) => option.toLowerCase().includes(val.toLowerCase()))
            )
        );

    ngOnInit() {
        this.inputValueSubject.next(this.initValue);
    }
}
