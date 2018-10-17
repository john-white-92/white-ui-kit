import { isWeekend } from 'date-fns';

// Интерфейсы
import { ICalendarItem } from '../interfaces';

// Позиция в календаре
export class CalendarItem implements ICalendarItem {

	// Текст
	public text: string = null;

	// Дата
	public date: Date = null;

	// Флаг, является ли дата - сегодняшней
	public isToday: boolean = false;

	// Флаг, является ли дата - выбранной
	public isSelected: boolean = false;

	// Флаг, выходной день
	public get isWeekend(): boolean {
		return isWeekend(this.date);
	}
}
