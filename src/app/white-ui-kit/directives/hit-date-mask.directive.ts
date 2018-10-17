import {
	Directive,
	ElementRef,
	EventEmitter,
	Output
} from '@angular/core';

// Маска ввода
import * as Inputmask from 'inputmask/dist/inputmask/inputmask.date.extensions';

// Директива - маска ввода даты
@Directive({
	selector: '[hitDateMask]'
})
export class HitDateMaskDirective {

	constructor(private readonly el: ElementRef) {
		Inputmask(this.SETTINGS)
			.mask(this.el.nativeElement);
	}

	// Событие, маска заполнена
	@Output() public completeMask = new EventEmitter<boolean>();

	// Параметры маски
	private readonly SETTINGS = {
		alias: 'datetime',
		inputFormat: 'dd.mm.yyyy',
		placeholder: 'дд.мм.гггг',
		autoUnmask: true,
		oncomplete: this.onComplete.bind(this),
		onincomplete: this.onIncomplete.bind(this)
	};

	// Обработчик заполнения маски
	private onComplete(): void {
		this.completeMask.emit(true);
	}

	// Обработчик снятия заполнения маски (после потери фокуса)
	private onIncomplete(): void {
		this.completeMask.emit(false);
	}
}
