import { Component } from '@angular/core';

// Страница проверки полей ввода
@Component({
	selector: 'app-inputs-page',
	templateUrl: './inputs-page.component.html',
	styleUrls: ['./inputs-page.component.scss']
})
export class InputsPageComponent {

	// Поле для ngModel
	public text: string = 'Lorem Ipsum';

	// Флаг, отключено
	public disabled: boolean = true;
}
