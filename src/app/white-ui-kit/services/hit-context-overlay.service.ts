import {
	Overlay,
	OverlayConfig,
	OverlayRef
} from '@angular/cdk/overlay';
import {
	ComponentPortal,
	PortalInjector
} from '@angular/cdk/portal';
import {
	Injectable,
	Injector
} from '@angular/core';

// Токены
import {
	POPUP_CONFIG,
	POPUP_DATA
} from '../tokens';

// Интерфейсы
import { IContextPopupConfig } from '../interfaces';

// Сервис контекстных всплывающих окон
@Injectable()
export class HitContextOverlayService {

	constructor(
		private readonly injector: Injector,
		private readonly overlay: Overlay
	) {}

	// Открыть всплывающее окно
	public open(config: IContextPopupConfig, data: any): OverlayRef {

		// Стратегия подключения
		const positionStrategy = this.overlay.position()
			.flexibleConnectedTo(config.elementRef)
			.withPositions([
				{
					overlayX: 'end',
					overlayY: 'top',
					originX: 'end',
					originY: 'bottom'
				},
				{
					overlayX: 'end',
					overlayY: 'bottom',
					originX: 'end',
					originY: 'top'
				}
			]);

		// Конфигурация
		const overlayConfig = new OverlayConfig({
			positionStrategy
		});

		// Всплывающее окно
		const overlayRef = this.overlay.create(overlayConfig);

		// Инжектор
		const injector = this.createInjector(overlayRef, config, data);

		// Создание экземпляра компонента
		const portal = new ComponentPortal<any>(
			config.overlayComponent,
			null,
			injector
		);

		// Подключение созданного компонента к слою всплывающего окна
		overlayRef.attach(portal);

		return overlayRef;
	}

	// Создать инжектор
	private createInjector(
		overlayRef: OverlayRef,
		config: IContextPopupConfig,
		data: any = null
	): PortalInjector {

		const injectionTokens = new WeakMap();

		injectionTokens.set(OverlayRef, overlayRef);
		injectionTokens.set(POPUP_CONFIG, config);
		injectionTokens.set(POPUP_DATA, data);

		return new PortalInjector(this.injector, injectionTokens);
	}
}
