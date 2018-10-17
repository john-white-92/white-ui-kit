import {
	Injectable,
	Renderer2,
	RendererFactory2
} from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

// Сенсор
import { ResizeSensor } from 'css-element-queries';

// Интерфейсы
import { ISize } from '../interfaces';

// Сервис скролла
@Injectable()
export class HitScrollService {

	constructor(rendererFactory: RendererFactory2) {
		this.renderer = rendererFactory.createRenderer(null, null);
		this.size$ = new ReplaySubject<ISize>(1);
		this.addSensor();
	}

	// ID области со скролом
	private readonly ID = `hit-scroll-sensor`;

	// Ссылка на renderer
	private readonly renderer: Renderer2;

	// Размер слайдера
	public readonly size$: ReplaySubject<ISize>;

	// Добавить сенсор размера скрола
	private addSensor(): void {
		if (!document.getElementById(this.ID)) {
			const SIZE_VIEW = 200;
			const view = this.renderer.createElement('div');
			const canvas = this.renderer.createElement('div');

			// tslint:disable-next-line:no-unused-expression
			new ResizeSensor(canvas, (): void => {
				const size = {
					width: SIZE_VIEW - canvas.offsetWidth,
					height: SIZE_VIEW - canvas.offsetHeight
				};
				this.size$.next(size);
			});

			this.renderer.setAttribute(view, 'id', this.ID);
			this.renderer.setStyle(view, 'overflow', 'scroll');
			this.renderer.setStyle(view, 'position', 'absolute');
			this.renderer.setStyle(view, 'margin', '0');
			this.renderer.setStyle(view, 'padding', '0');
			this.renderer.setStyle(view, 'left', '-10000px');
			this.renderer.setStyle(view, 'top', '-10000px');
			this.renderer.setStyle(view, 'visibility', 'hidden');
			this.renderer.setStyle(view, 'opacity', '0');
			this.renderer.setStyle(view, 'box-sizing', 'border-box');
			this.renderer.setStyle(view, 'width', `${SIZE_VIEW}px`);
			this.renderer.setStyle(view, 'height', `${SIZE_VIEW}px`);
			this.renderer.setStyle(canvas, 'position', 'absolute');
			this.renderer.setStyle(canvas, 'top', '0');
			this.renderer.setStyle(canvas, 'right', '0');
			this.renderer.setStyle(canvas, 'bottom', '0');
			this.renderer.setStyle(canvas, 'left', '0');
			this.renderer.setStyle(canvas, 'padding', '0');
			this.renderer.setStyle(canvas, 'margin', '0');
			this.renderer.setStyle(canvas, 'box-sizing', 'border-box');
			this.renderer.appendChild(view, canvas);
			this.renderer.appendChild(document.body, view);
		}
	}
}
