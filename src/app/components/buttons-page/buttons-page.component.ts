import { Component } from '@angular/core';

// Страница проверки кнопок
@Component({
	selector: 'app-buttons-page',
	templateUrl: './buttons-page.component.html',
	styleUrls: ['./buttons-page.component.scss']
})
export class ButtonsPageComponent {

	// Флаг
	public isDisabled = true;
}
