import { OverlayRef } from '@angular/cdk/overlay';
import {
	Component,
	ElementRef,
	Inject,
	OnDestroy,
	Renderer2
} from '@angular/core';

// Токены
import {
	POPUP_CONFIG,
	POPUP_DATA
} from '../../tokens';

// Хелпер
import { EventHelper } from '../../helpers';

// Всплывающее контекстное окно
@Component({
	selector: 'hit-context-popup',
	template: ''
})
export class HitContextPopupComponent implements OnDestroy {

	constructor(
		private readonly renderer: Renderer2,
		private readonly el: ElementRef,
		private readonly overlayRef: OverlayRef,
		@Inject(POPUP_CONFIG) public readonly config: any,
		@Inject(POPUP_DATA) public readonly data: any
	) {
		this.addListener();
	}

	// Функция для отписки от обработчика мисклика
	private clickListen: () => void;

	// Добавить обработчик мисклика
	private addListener(): void {
		// Игнорируем клик который вызвал окно
		setTimeout(() => {
			this.clickListen = this.renderer.listen(
				document,
				'click',
				this.onClick.bind(this)
			);
		});
	}

	// Обработчик мисклика
	private onClick(event: MouseEvent): void {
		const overlayEl = this.el && this.el.nativeElement;
		const originEl = this.config.elementRef && this.config.elementRef.nativeElement;
		const path = EventHelper.path(event);
		const isOverlayEl = path.some((node: Node) => node === overlayEl);
		const isOriginEl = path.some((node: Node) => node === originEl);

		if (!isOverlayEl && !isOriginEl) {
			this.close();
		}
	}

	// Закрыть окно
	public close(): void {
		this.overlayRef.dispose();
	}

	// Уничтожение
	public ngOnDestroy(): void {
		if (this.clickListen) { this.clickListen(); }
	}
}
