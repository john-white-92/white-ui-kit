import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Компоненты
import {
	ButtonsPageComponent,
	CheckboxPageComponent,
	DatepickerPageComponent,
	InputsPageComponent,
	ScrollPageComponent,
	SliderPageComponent
} from './components';

// Базовые маршруты
const routes: Routes = [

	// Кнопки
	{
		path: 'buttons',
		component: ButtonsPageComponent
	},
	// Поля ввода
	{
		path: 'inputs',
		component: InputsPageComponent
	},
	// Чекбокс
	{
		path: 'checkbox',
		component: CheckboxPageComponent
	},
	// Даты
	{
		path: 'date',
		component: DatepickerPageComponent
	},
	// Скролл
	{
		path: 'scroll',
		component: ScrollPageComponent
	},
	// Слайдер
	{
		path: 'slider',
		component: SliderPageComponent
	},
	// Некорректный маршрут
	{
		path: '**',
		redirectTo: '/'
	}
];

// Основной модуль машрутизации
@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
