import {
	CdkOverlayOrigin,
	OverlayRef
} from '@angular/cdk/overlay';
import {
	Component,
	EventEmitter,
	forwardRef,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	ViewChild
} from '@angular/core';
import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
	format,
	parse
} from 'date-fns';
import * as ru from 'date-fns/locale/ru';

// Компоненты
import { HitDatepickerPopupComponent } from '../hit-datepicker-popup/hit-datepicker-popup.component';

// Сервисы
import { HitContextOverlayService } from '../../services';

// Поле выбора даты
@Component({
	selector: 'hit-datepicker',
	templateUrl: './hit-datepicker.component.html',
	styleUrls: ['./hit-datepicker.component.scss'],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => HitDatepickerComponent),
		multi: true
	}]
})
export class HitDatepickerComponent implements
	OnInit, OnDestroy, ControlValueAccessor {

	constructor(private readonly contextOverlay: HitContextOverlayService) {
		this.DATA.select.subscribe((date: Date) => { this.date = date; });
	}

	// Ссылка на поле ввода
	@ViewChild('popupOrigin') private readonly popupOrigin: CdkOverlayOrigin;

	// Заглушка поля
	@Input() public placeholder: string;

	// Флаг наличия ошибки
	@Input() public hasError: boolean;

	// Вызовем когда значение изменится
	private onChange: (value: Date) => void;

	// Вызовем при любом дествии пользователя с контроллом
	private onTouched: () => void;

	// Дата
	public _date: Date;
	public get date(): Date {
		return this._date;
	}
	public set date(value: Date) {
		this._date = value;
		this.DATA.selected = value;
		this.text = value && format(value, 'DD.MM.YYYY', { locale: ru });

		if (this.onChange) {
			this.onChange(value);
		}
	}

	// Поле ввода
	public text: string;

	// Флаг, отключено
	public disabled: boolean = false;

	// Ссылка на календарь
	private overlayRef: OverlayRef;

	// Флаг, календарь открыт
	private get isCalendarOpened(): boolean {
		return !!(this.overlayRef && this.overlayRef.hasAttached());
	}

	// Конфигурация всплывающего окна
	private readonly CONFIG = {
		elementRef: null,
		overlayComponent: HitDatepickerPopupComponent
	};

	// Данные календаря
	private readonly DATA = {
		selected: null,
		select: new EventEmitter<Date>()
	};

	// --------------------------------------------------------------------------
	// Открыть/скрыть календаь
	public onToggle(): void {
		if (this.isCalendarOpened) {
			this.close();
		} else {
			this.open();
		}
	}

	// Обработчик заполнености маски
	public onCompleteMask(isCompleted: boolean): void {
		this.date = isCompleted
			? parse(
					this.text
						.split('.')
						.reverse()
						.join('-')
				)
			: null;
	}

	// --------------------------------------------------------------------------
	// Открыть окно
	private open(): void {
		if (!this.isCalendarOpened && !this.disabled) {
			this.overlayRef = this.contextOverlay.open(this.CONFIG, this.DATA);
		}
	}

	// Закрыть окно
	private close(): void {
		if (this.overlayRef) { this.overlayRef.dispose(); }
	}

	// --------------------------------------------------------------------------
	// Реакция на клик хост-элемента
	@HostListener('click') public onClick(): void {
		if (this.onTouched) { this.onTouched(); }
	}

	// Вызовет форма, если значение изменилось извне
	public writeValue(date: Date): void {
		this.date = date;
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

	// --------------------------------------------------------------------------
	// Инициализация
	public ngOnInit(): void {
		this.CONFIG.elementRef = this.popupOrigin.elementRef;
	}

	// Уничтожение
	public ngOnDestroy(): void {
		this.close();
	}
}
