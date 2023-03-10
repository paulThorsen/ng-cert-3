import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MultiStateButtonComponent } from './core/components/multi-state-button/multi-state-button.component';
import { TypeaheadComponent } from './core/components/typeahead/typeahead.component';
import { WeatherImageComponent } from './core/components/weather-image/weather-image.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForecastComponent } from './forecast/forecast.component';

@NgModule({
    declarations: [AppComponent, DashboardComponent, ForecastComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MultiStateButtonComponent,
        TypeaheadComponent,
        WeatherImageComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
