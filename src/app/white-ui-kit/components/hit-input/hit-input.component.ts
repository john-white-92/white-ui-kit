import { Component, HostBinding, Input } from '@angular/core';

// Поле ввода
@Component({
	selector: '[hit-input]',
	styleUrls: ['./hit-input.component.scss'],
	template: ''
})
export class HitInputComponent {

	// Флаг наличия ошибки
	@Input() public hasError: boolean;
	@HostBinding('attr.has-error') public get attrHasError(): string {
		return this.hasError ? 'has-error' : null;
	}
}
