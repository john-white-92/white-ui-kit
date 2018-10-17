import {
	Component,
	HostBinding,
	Input
} from '@angular/core';

// Кнопка
@Component({
	selector: '[hit-button]',
	templateUrl: './hit-button.component.html',
	styleUrls: ['./hit-button.component.scss']
})
export class HitButtonComponent {

	// Тип кнопки
	@HostBinding('attr.button-type')
	@Input() public buttonType: string;

	// Выравнивание контента
	@HostBinding('attr.content-align')
	@Input() public contentAlign: string;
}
