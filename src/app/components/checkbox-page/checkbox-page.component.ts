import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

// Страница проверки hit-checkbox
@Component({
	selector: 'app-checkbox-page',
	templateUrl: './checkbox-page.component.html',
	styleUrls: ['./checkbox-page.component.scss']
})
export class CheckboxPageComponent {

	constructor() {
		this.form = new FormGroup({
			flag: new FormControl(),
			flagDisabled: new FormControl()
		});
		const handler = (value: boolean): void => {
			if (this.checked !== value) {
				this.checked = value;
			}
		};
		this.flag.valueChanges.subscribe(handler.bind(this));
		this.flagDisabled.valueChanges.subscribe(handler.bind(this));
	}

	// Форма
	public form: FormGroup;

	// Флаг
	public get flag(): AbstractControl {
		return this.form.get('flag');
	}

	// Флаг, disabled
	public get flagDisabled(): AbstractControl {
		return this.form.get('flagDisabled');
	}

	// Флаг, выбрано
	private _checked: boolean = true;
	public get checked(): boolean {
		return this._checked;
	}
	public set checked(value: boolean) {
		this._checked = value;

		// Реактивная форма
		this.flag.setValue(value);
		this.flagDisabled.setValue(value);
	}

	// Флаг, отключено
	private _disabled: boolean = true;
	public get disabled(): boolean {
		return this._disabled;
	}
	public set disabled(value: boolean) {
		this._disabled = value;

		// Реактивная форма
		if (value) {
			this.flagDisabled.disable();
		} else {
			this.flagDisabled.enable();
		}
	}
}
