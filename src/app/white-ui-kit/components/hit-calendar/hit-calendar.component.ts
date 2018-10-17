import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import {
	addDays,
	addMonths,
	addYears,
	endOfYear,
	format,
	getDay,
	isSameDay,
	isSameMonth,
	isSameYear,
	max,
	min,
	setMonth,
	setYear,
	startOfMonth,
	startOfYear,
	subMonths,
	subYears
} from 'date-fns';
import * as ru from 'date-fns/locale/ru';

// Интерфейсы
import { ICalendarItem } from '../../interfaces';

// Модели
import { CalendarItem } from '../../models';

// Перечисления
import { CalendarMode } from '../../enums';

// Сервисы
import { MathHelper } from '../../helpers';

// Календарь
@Component({
	selector: 'hit-calendar',
	templateUrl: './hit-calendar.component.html',
	styleUrls: ['./hit-calendar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HitCalendarComponent implements OnChanges {

	// Выбранная дата
	@Input() public selected: Date;

	// Событие выбора даты
	@Output() public select = new EventEmitter<Date>();

	// Максимальное кол-во недель в месяце
	private readonly MAX_WEEKS_IN_MONTH_COUNT = 6;

	// Кол-во дней в неделе
	private readonly DAYS_IN_WEEK_COUNT = 7;

	// Минимальный год
	private readonly MIN_YEAR = 100;

	// Максимальный год
	private readonly MAX_YEAR = 9999;

	// Минимальная дата
	private readonly MIN_DATE = startOfYear(new Date(this.MIN_YEAR, 0, 1));

	// Максимальная дата
	private readonly MAX_DATE = endOfYear(new Date(this.MAX_YEAR, 0, 1));

	// Годов в строке
	private readonly YEARS_IN_ROW_COUNT = 4;

	// Строк с годами
	private readonly YEARS_ROW_COUNT = 6;

	// Лет на страницу
	private readonly YEARS_PER_PAGE = this.YEARS_IN_ROW_COUNT * this.YEARS_ROW_COUNT;

	// Месяцев в строке
	private readonly MONTH_IN_ROW_COUNT = 4;

	// Строк с месяцами
	private readonly MONTH_ROW_COUNT = 3;

	// Наименование дней
	public readonly NAME_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

	// Отображаемые позиции
	public itemsList: ICalendarItem[][];

	// Режим отображения
	public mode: CalendarMode = CalendarMode.Month;

	// Перечисления режимов отображения в календаре
	public CalendarMode: typeof CalendarMode = CalendarMode;

	// Дата курсора отображения
	private _cursor: Date;
	private get cursor(): Date {
		return this._cursor || new Date();
	}
	private set cursor(value: Date) {
		this._cursor = max(min(value, this.MAX_DATE), this.MIN_DATE);
	}

	// Текст на кнопке контроля отображения
	public title: string;

	// --------------------------------------------------------------------------
	// Отобразить месяц разбитый по неделям (и дням)
	private monthView(): void {
		const today = new Date();

		let current = startOfMonth(this.cursor);
		this.itemsList = Array(this.MAX_WEEKS_IN_MONTH_COUNT)
			.fill(null)
			.map((valueWeek: any, numberWeek: number) =>
				Array(this.DAYS_IN_WEEK_COUNT)
					.fill(null)
					.map((valueDay: any, numberDay: number) => {
						const item = new CalendarItem();

						// Приведение к: понедельник - 0
						let day = getDay(current) || this.DAYS_IN_WEEK_COUNT;
						day--;

						if (
							day === numberDay &&
							current.getMonth() === this.cursor.getMonth()
						) {
							item.date = current;
							item.text = `${current.getDate()}`;
							item.isToday = isSameDay(today, current);
							item.isSelected = isSameDay(this.selected, current);
							current = addDays(current, 1);
						}

						return item;
					})
			);
		this.title = format(this.cursor, 'MMMM YYYY', { locale: ru });
	}

	// Отобразить год
	private yearView(): void {
		const today = new Date();

		let current = startOfYear(this.cursor);
		this.itemsList = Array(this.MONTH_ROW_COUNT)
			.fill(null)
			.map(() =>
				Array(this.MONTH_IN_ROW_COUNT)
					.fill(null)
					.map(() => {
						const item = new CalendarItem();

						item.date = current;
						item.text = format(current, 'MMM', { locale: ru })
							.replace(/\./g, '');
						item.isToday = isSameMonth(today, current);
						item.isSelected = isSameMonth(this.selected, current);
						current = addMonths(current, 1);

						return item;
					})
			);
		this.title = format(this.cursor, 'YYYY', { locale: ru });
	}

	// Отобразить диапазон лет
	private rangeYearsView(): void {
		const today = new Date();
		const cursorYear = this.cursor.getFullYear();
		const yearStart = MathHelper.clamp(
			Math.floor(cursorYear / this.YEARS_PER_PAGE) * this.YEARS_PER_PAGE,
			this.MIN_YEAR,
			this.MAX_YEAR
		);
		const yearEnd = MathHelper.clamp(
			yearStart + this.YEARS_PER_PAGE - 1,
			this.MIN_YEAR,
			this.MAX_YEAR
		);

		let current = new Date(yearStart, 0, 1);
		this.itemsList = Array(this.YEARS_ROW_COUNT)
			.fill(null)
			.map(() =>
				Array(this.YEARS_IN_ROW_COUNT)
					.fill(null)
					.map(() => {
						const item = new CalendarItem();

						if (current.getFullYear() <= yearEnd) {
							item.date = current;
							item.text = `${current.getFullYear()}`;
							item.isToday = isSameYear(today, current);
							item.isSelected = isSameYear(this.selected, current);
							current = addYears(current, 1);
						}

						return item;
					})
			);

		this.title = `${yearStart} — ${yearEnd}`;
	}

	// Обновить
	private update(): void {
		switch (this.mode) {
			case CalendarMode.Month:
				this.monthView();
				break;
			case CalendarMode.Year:
				this.yearView();
				break;
			case CalendarMode.RangeYears:
				this.rangeYearsView();
				break;
			default:
		}
	}

	// --------------------------------------------------------------------------
	// Смена режима отображения
	public onChangeMode(): void {
		this.mode = this.mode === CalendarMode.Month
			? CalendarMode.RangeYears
			: CalendarMode.Month;
		this.update();
	}

	// Выбор позиции
	public onSelect(item: ICalendarItem): void {
		switch (this.mode) {
			case CalendarMode.Month:
				this.select.emit(item.date);
				break;
			case CalendarMode.Year:
				this.cursor = setMonth(this.cursor, item.date.getMonth());
				this.mode = CalendarMode.Month;
				break;
			case CalendarMode.RangeYears:
				this.cursor = setYear(this.cursor, item.date.getFullYear());
				this.mode = CalendarMode.Year;
				break;
			default:
		}
		this.update();
	}

	// Шаг в лево
	public onLeft(): void {
		switch (this.mode) {
			case CalendarMode.Month:
				this.cursor = subMonths(this.cursor, 1);
				break;
			case CalendarMode.Year:
				this.cursor = subYears(this.cursor, 1);
				break;
			case CalendarMode.RangeYears:
				this.cursor = subYears(this.cursor, this.YEARS_PER_PAGE);
				break;
			default:
		}
		this.update();
	}

	// Шаг в право
	public onRight(): void {
		switch (this.mode) {
			case CalendarMode.Month:
				this.cursor = addMonths(this.cursor, 1);
				break;
			case CalendarMode.Year:
				this.cursor = addYears(this.cursor, 1);
				break;
			case CalendarMode.RangeYears:
				this.cursor = addYears(this.cursor, this.YEARS_PER_PAGE);
				break;
			default:
		}
		this.update();
	}

	// --------------------------------------------------------------------------
	// HOOKS
	// Изменение входных параметров
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.selected) {
			if (!this._cursor && this.selected) {
				this.cursor = this.selected;
			}
			this.update();
		}
	}
}
