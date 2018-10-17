import { Component } from '@angular/core';

// Компоненты
import { HitContextPopupComponent } from '../hit-context-popup/hit-context-popup.component';

// Всплывающее окно календаря
@Component({
	selector: 'hit-datepicker-popup',
	templateUrl: './hit-datepicker-popup.component.html',
	styleUrls: ['./hit-datepicker-popup.component.scss']
})
export class HitDatepickerPopupComponent extends HitContextPopupComponent {

	// Выбор даты
	public onSelectDate(date: Date): void {
		this.data.select.emit(date);
		this.close();
	}
}
