import { Component } from '@angular/core';

// Страница проверки слайдера
@Component({
	selector: 'app-slider-page',
	templateUrl: './slider-page.component.html',
	styleUrls: ['./slider-page.component.scss']
})
export class SliderPageComponent {

	// Размер одной "линии" контента
	private readonly LINE_SIZE = 30;

	// Размер области отображения
	public size: number = 200;

	// Размер контента
	public max: number = 1000;

	// Текущая позиция
	private _current: number = 0;
	public get current(): number {
		return this._current;
	}
	public set current(value: number) {
		this._current = Math.min(Math.max(value, 0), this.maxOffset);
	}

	// Максимальное смещение
	public get maxOffset(): number {
		return this.max - this.size;
	}

	// Обработчик перемещения слайдера
	public onSliderMoved(percent: number): void {
		this.current = Math.round(percent * this.maxOffset);
	}

	// Обработчик смещения на одну линию
	public onLineUp(): void {
		this.current -= this.LINE_SIZE;
	}

	// Обработчик смещения на одну линию
	public onLineDown(): void {
		this.current += this.LINE_SIZE;
	}

	// Обработчик смещения на одну страницу
	public onPageUp(): void {
		this.current -= this.size;
	}

	// Обработчик смещения на одну страницу
	public onPageDown(): void {
		this.current += this.size;
	}
}
