import { of } from 'rxjs';
import { WeatherService } from '../weather.service';
import { mockProvo5DayForecast } from './mock-data/mock-provo-5-day-forecast';
import { mockProvoWeather } from './mock-data/mock-provo-weather';

export const weatherServiceSpy: jasmine.SpyObj<WeatherService> =
    jasmine.createSpyObj<WeatherService>('WeatherService', {
        getWeatherConditionsByZip: of(mockProvoWeather),
        getDayForecastByZip: of(mockProvo5DayForecast),
    });
