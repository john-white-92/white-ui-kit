import { ElementRef } from '@angular/core';

// Конфигурация контекстных всплывающих окон
export interface IContextPopupConfig {

		// Ссылка на компонент (overlay)
		overlayComponent?: any;

		// Ссылка на origin
		elementRef?: ElementRef;
}
