import {
	Component,
	EventEmitter,
	forwardRef,
	HostBinding,
	HostListener,
	Input,
	Output
} from '@angular/core';
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR
} from '@angular/forms';

// Чекбокс
@Component({
	selector: '[hit-checkbox]',
	templateUrl: './hit-checkbox.component.html',
	styleUrls: ['./hit-checkbox.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => HitCheckboxComponent),
		multi: true
	}]
})
export class HitCheckboxComponent implements ControlValueAccessor {

	// Вызовем когда значение изменится
	private onChange: (value: boolean) => void;

	// Вызовем при любом дествии пользователя с контроллом
	private onTouched: () => void;

	// Флаг, выбрано
	private _checked: boolean = false;
	public get checked(): boolean {
		return this._checked;
	}
	@Input() public set checked(value: boolean) {
		this._checked = value;
		this.check.emit(value);

		if (this.onChange) { this.onChange(value); }
	}

	// Флаг, отключено
	private _disabled: boolean = false;
	public get disabled(): boolean {
		return this._disabled;
	}
	@Input() public set disabled(value: boolean) {
		this._disabled = value;
	}
	@HostBinding('attr.disabled') public get attrDisabled(): string {
		return this.disabled ? 'disabled' : null;
	}

	// Событие установки флага
	@Output() public check = new EventEmitter<boolean>();

	// --------------------------------------------------------------------------
	// Реакция на клик хост-элемента
	@HostListener('click') public onClick(): void {
		if (this.onTouched) { this.onTouched(); }
	}

	// Вызовет форма, если значение изменилось извне
	public writeValue(checked: boolean): void {
		this.checked = checked;
	}

	// Сохраняем обратный вызов для изменений
	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	// Сохраняем обратный вызов для "касаний"
	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	// Установка состояния disabled
	public setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
}
