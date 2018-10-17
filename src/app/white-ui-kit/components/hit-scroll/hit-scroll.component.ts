import {
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewChild
} from '@angular/core';

// Сенсор
import { ResizeSensor } from 'css-element-queries';

// Интерфейсы
import { IOffset, ISize } from '../../interfaces';

// Перечисления
import { Direction } from '../../enums';

// Сервисы
import { HitScrollService } from '../../services';

// Компоненты
import { HitSliderComponent } from '../hit-slider/hit-slider.component';

// Скролл
@Component({
	selector: 'hit-scroll',
	templateUrl: './hit-scroll.component.html',
	styleUrls: ['./hit-scroll.component.scss']
})
export class HitScrollComponent
	implements OnInit, OnDestroy {

	constructor(
		private readonly scrollService: HitScrollService,
		private readonly renderer: Renderer2
	) {
		this.scrollService.size$.subscribe({
			next: (size: ISize): void => {
				this.compensation = size;
			}
		});
	}

	// Направление прокрутки
	@Input() public direction: string;

	// Ссылка на область оболочки отображения
	@ViewChild('wrapperRef') public wrapperRef: ElementRef;

	// Ссылка на область отображения
	@ViewChild('viewportRef') public viewportRef: ElementRef;

	// Ссылка на область контента
	@ViewChild('canvasRef') public canvasRef: ElementRef;

	// Ссылка на вертикальный слайдер
	@ViewChild('verticalSlider') public verticalSlider: HitSliderComponent;

	// Ссылка на горизонтальный слайдер
	@ViewChild('horizontalSlider') public horizontalSlider: HitSliderComponent;

	// Размер одной "линии" для прокрутки (px)
	public readonly LINE_SIZE = 10;

	// Функции для отключения прослушивания события
	private scrollListen: () => void;

	// Флаги направлений
	public get isHorizontal(): boolean {
		return this.direction === Direction.Horizontal;
	}
	public get isVertical(): boolean {
		return this.direction === Direction.Vertical;
	}

	// Сенсор изменения размера wrapper
	private resizeSensorWrapper: any;

	// Сенсор изменения размера canvas
	private resizeSensorCanvas: any;

	// Размер компенсации системных слайдеров
	public compensation: ISize;

	// Размер области оболочки отображения
	public readonly wrapper: ISize = {
		width: 0,
		height: 0
	};

	// Размер области контента
	public readonly canvas: ISize = {
		width: 0,
		height: 0
	};

	// Смещение области контента в области отображения
	public readonly offset: IOffset = {
		left: 0,
		top: 0
	};

	// Слайдеры
	public readonly sliders: any = {
		width: 0,
		height: 0,
		isHorizontal: false,
		isVertical: false
	};

	// --------------------------------------------------------------------------
	// Добавить подписку на скролл
	private addScrollHandler(): void {
		this.scrollListen = this.renderer.listen(
			this.viewportRef.nativeElement,
			'scroll',
			this.updateOffset.bind(this)
		);
	}

	// Добавить сенсоры
	private addSensors(): void {
		this.resizeSensorWrapper = new ResizeSensor(
			this.wrapperRef.nativeElement,
			this.updateWrapper.bind(this)
		);
		this.resizeSensorCanvas = new ResizeSensor(
			this.canvasRef.nativeElement,
			this.updateCanvas.bind(this)
		);
	}

	// Удалить сенсоры
	private removeSensors(): void {
		if (this.resizeSensorWrapper) { this.resizeSensorWrapper.detach(); }
		if (this.resizeSensorCanvas) { this.resizeSensorCanvas.detach(); }
	}

	// Удалить обработчик скролла
	private removeScrollHandler(): void {
		if (this.scrollListen) { this.scrollListen(); }
	}

	// Обновить смещения
	private updateOffset(): void {
		this.offset.left = this.viewportRef.nativeElement.scrollLeft;
		this.offset.top = this.viewportRef.nativeElement.scrollTop;
	}

	// Обновить область оболочки отображения
	private updateWrapper(): void {
		this.wrapper.width = this.wrapperRef.nativeElement.offsetWidth;
		this.wrapper.height = this.wrapperRef.nativeElement.offsetHeight;
		this.updateSliders();
	}

	// Обновить область контента
	private updateCanvas(): void {
		this.canvas.width = this.canvasRef.nativeElement.offsetWidth;
		this.canvas.height = this.canvasRef.nativeElement.offsetHeight;
		this.updateSliders();
	}

	// Обновить видимость слайдеров
	private updateSliders(): void {
		// Защита от ложного переключения флагов
		setTimeout((): void => {

			this.sliders.isHorizontal =
				!this.isVertical &&
				this.canvas.width > this.wrapper.width;

			this.sliders.isVertical =
				!this.isHorizontal &&
				this.canvas.height > this.wrapper.height;

			const isBoth = this.sliders.isHorizontal && this.sliders.isVertical;
			this.sliders.width = isBoth && this.verticalSlider.sliderCrossSize;
			this.sliders.height = isBoth && this.horizontalSlider.sliderCrossSize;
		});
	}

	// --------------------------------------------------------------------------
	// Обработчик горизонтального перемещения слайдера
	public onHorizontalSliderMoved(percent: number): void {
		this.viewportRef.nativeElement.scrollLeft =
			(this.canvas.width - this.wrapper.width) * percent;
	}

	// Обработчик вертикального перемещения слайдера
	public onVerticalSliderMoved(percent: number): void {
		this.viewportRef.nativeElement.scrollTop =
			(this.canvas.height - this.wrapper.height) * percent;
	}

	// Обработчик горизонтальной прокрутки
	public onHorizontalScroll(delta: number): void {
		this.viewportRef.nativeElement.scrollLeft += delta;
	}

	// Обработчик вертикальной прокрутки
	public onVerticalScroll(delta: number): void {
		this.viewportRef.nativeElement.scrollTop += delta;
	}

	// --------------------------------------------------------------------------
	// HOOKS
	// Инициализация
	public ngOnInit(): void {
		this.addScrollHandler();
		this.addSensors();
		this.updateWrapper();
		this.updateCanvas();
	}

	// Уничтожение
	public ngOnDestroy(): void {
		this.removeScrollHandler();
		this.removeSensors();
	}
}
