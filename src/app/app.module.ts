import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

// Модули
import { AppRoutingModule } from './app-routing.module';
import { WhiteUiKitModule } from './white-ui-kit/white-ui-kit.module';

// Компоненты
import { AppComponent } from './app.component';
import {
	ButtonsPageComponent,
	CheckboxPageComponent,
	DatepickerPageComponent,
	InputsPageComponent,
	ScrollPageComponent,
	SliderPageComponent,
	TestRowComponent
} from './components';

// Основной модуль приложения демонстрации компонентов
@NgModule({
	declarations: [
		AppComponent,
		ButtonsPageComponent,
		CheckboxPageComponent,
		DatepickerPageComponent,
		InputsPageComponent,
		ScrollPageComponent,
		SliderPageComponent,
		TestRowComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
		WhiteUiKitModule.forRoot()
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
