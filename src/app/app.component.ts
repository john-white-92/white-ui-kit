import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	// Вкладки
	public readonly links = [
		{ title: 'Кнопки', link: '/buttons' },
		{ title: 'Поля ввода', link: '/inputs' },
		{ title: 'Чекбокс', link: '/checkbox' },
		{ title: 'Даты', link: '/date' },
		{ title: 'Скролл', link: '/scroll' },
		{ title: 'Слайдер', link: '/slider' }
	];
}
