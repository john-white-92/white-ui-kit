// Позиция в календаре
export interface ICalendarItem {

	// Текст
	text: string;

	// Дата
	date: Date;

	// Флаг, является ли дата - сегодняшней
	isToday: boolean;

	// Флаг, является ли дата - выбранной
	isSelected: boolean;

	// Флаг, выходной день
	isWeekend?: boolean;
}
