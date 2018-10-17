import { Component } from '@angular/core';

// Страница проверки полей ввода дат
@Component({
	selector: 'app-datepicker-page',
	templateUrl: './datepicker-page.component.html',
	styleUrls: ['./datepicker-page.component.scss']
})
export class DatepickerPageComponent {

	// Тестовая дата календаря
	public testData: Date = null;

	// Флаг, отключено
	public disabled: boolean = true;
}
