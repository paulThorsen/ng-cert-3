import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';
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
    @ViewChild('input') input!: ElementRef;

    @Input() ariaLabel = 'input';
    @Input() id = '';
    @Input() placeholder = '';
    @Input() options: string[] = [];
    @Input() initValue = '';
    @Output() inputValue = new EventEmitter();

    public showOptions = false;
    public inputValueSubject = new BehaviorSubject<string>('');
    public optionsDisplayed$: Observable<string[]> = this.inputValueSubject.asObservable().pipe(
        tap((val) => this.inputValue.emit(val)),
        map((val) =>
            this.options.filter((option) => option.toLowerCase().includes(val.toLowerCase()))
        )
    );

    ngOnInit() {
        this.inputValueSubject.next(this.initValue);
    }

    public clearInput = () => {
        this.inputValueSubject.next('');
        this.input.nativeElement.focus();
    };
}
