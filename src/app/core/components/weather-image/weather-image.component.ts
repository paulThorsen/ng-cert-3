import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-weather-image',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    templateUrl: './weather-image.component.html',
})
export class WeatherImageComponent {
    @Input() condition = '';
    @Input() styles!: Record<string, string>;
    public conditionImages = ['Clouds', 'Clear', 'Rain', 'Snow'];
}
