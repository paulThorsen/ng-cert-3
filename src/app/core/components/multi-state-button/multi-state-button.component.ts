import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

export type ButtonState = 'default' | 'loading' | 'complete';

@Component({
    selector: 'app-multi-state-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './multi-state-button.component.html',
    styleUrls: ['./multi-state-button.component.scss'],
})
export class MultiStateButtonComponent {
    @Input() buttonType: string = '';
    @Input() stateObservable$: Observable<ButtonState> = of('default');
    @Output() buttonClick = new EventEmitter();
}
