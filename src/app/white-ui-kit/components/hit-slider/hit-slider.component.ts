import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	ViewChild
} from '@angular/core';

// Сенсор
import { ResizeSensor } from 'css-element-queries';

// Хелпер
import { MathHelper } from '../../helpers';

// Перечисления
import {
	Direction,
	SliderType
} from '../../enums';

// Слайдер
@Component({
	selector: 'hit-slider',
	templateUrl: './hit-slider.component.html',
	styleUrls: ['./hit-slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HitSliderComponent
	implements OnInit, OnDestroy, OnChanges {

	// Конструктор
	constructor(private readonly renderer: Renderer2) {}

	// Тип слайдера
	@HostBinding('attr.slider-type')
	@Input() public type: SliderType = SliderType.Default;

	// Направление слайдера
	@Input() public direction: Direction;

	// Размер области отображения
	@Input() public viewport: number = 0;

	// Размер области контента в области отображения
	@Input() public canvas: number = 0;

	// Смещение области контента в области отображения
	@Input() public offset: number = 0;

	// Событие перемещения каретки в слайдере
	@Output() public sliderMoved = new EventEmitter<number>();

	// Событие прокрутки в слайдере на одну линию вверх
	@Output() public sliderLineUp = new EventEmitter<void>();

	// Событие прокрутки в слайдере на одну линию вниз
	@Output() public sliderLineDown = new EventEmitter<void>();

	// Событие прокрутки в слайдере на одну страницу вверх
	@Output() public sliderPageUp = new EventEmitter<void>();

	// Событие прокрутки в слайдере на одну страницу вниз
	@Output() public sliderPageDown = new EventEmitter<void>();

	// Ссылка на элемент слайдера в DOM
	@ViewChild('slider') public slider: ElementRef;

	// Ссылка на элемент каретки в DOM
	@ViewChild('thumb') public thumb: ElementRef;

	// Ссылка на обьект для touch событий
	private touchTarget: Element;

	// Сенсор изменения размера
	private resizeSensor: any;

	// Размер слайдера
	public sliderSize: number = 0;

	// Размер слайдера (поперечный)
	public sliderCrossSize: number = 0;

	// Минимальный размер каретки
	public readonly MIN_THUMB_SIZE: number = 62;

	// Размер каретки
	public thumbSize: number = 0;

	// Позиция каретки
	public thumbPos: number = 0;

	// Коэффициент смещения от начала каретки в момент захвата
	public thumbPosRatio: number = 0;

	// Начальная позиция каретки в момент захвата
	public thumbPosStart: number = 0;

	// Нажата ли каретка
	public isThumbPressed: boolean = false;

	// Функции для отключения прослушивания событий
	private mouseMoveListen: () => void;
	private mouseUpListen: () => void;
	private touchMoveListen: () => void;
	private touchEndListen: () => void;

	// Является ли слайдер вертикальным?
	public get isVertical(): boolean {
		return this.direction === Direction.Vertical;
	}

	// Стиль каретки
	public get thumbStyle(): any {
		return this.isVertical
			? {
				height: `${this.thumbSize}px`,
				transform: `translateY(${this.thumbPos}px)`
			}
			: {
				width: `${this.thumbSize}px`,
				transform: `translateX(${this.thumbPos}px)`
			};
	}

	// --------------------------------------------------------------------------
	// MOUSE
	// Нажатие на каретку
	public onMouseDown(event: MouseEvent): void {
		this.isThumbPressed = true;
		this.mouseMoveListen = this.renderer.listen(
			document,
			'mousemove',
			this.onMouseMove.bind(this)
		);
		this.mouseUpListen = this.renderer.listen(
			document,
			'mouseup',
			this.onMouseUp.bind(this)
		);
		this.sliderPressed(event.clientX, event.clientY);
	}

	// Перемещение каретки
	public onMouseMove(event: MouseEvent): void {
		this.sliderMove(event.clientX, event.clientY);
	}

	// Отжатие каретки
	public onMouseUp(event: MouseEvent): void {
		this.isThumbPressed = false;
		this.removeEvents();
	}

	// --------------------------------------------------------------------------
	// TOUCH
	// Нажатие на каретку
	public onTouchStart(event: TouchEvent): void {
		const touch = event.touches[event.touches.length - 1];
		const touchTarget = (
			event.target ||
			event.srcElement ||
			event.currentTarget
		) as Element;

		if (touch) {
			this.touchTarget = touchTarget;
			this.isThumbPressed = true;
			this.touchMoveListen = this.renderer.listen(
				this.touchTarget,
				'touchmove',
				this.onTouchMove.bind(this)
			);
			this.touchEndListen = this.renderer.listen(
				this.touchTarget,
				'touchend',
				this.onTouchEnd.bind(this)
			);
			this.sliderPressed(touch.clientX, touch.clientY);
		}
	}

	// Перемещение каретки
	public onTouchMove(event: TouchEvent): void {
		const touch = event.touches[event.touches.length - 1];
		this.sliderMove(touch.clientX, touch.clientY);
	}

	// Отжатие каретки
	public onTouchEnd(event: TouchEvent): void {
		this.isThumbPressed = false;
		this.removeEvents();
		this.removeLinks();
	}

	// --------------------------------------------------------------------------
	// BUTTON
	// Событие прокрутки в слайдере на одну линию вверх
	public onLineUp(): void {
		this.sliderLineUp.emit();
	}

	// Событие прокрутки в слайдере на одну линию вниз
	public onLineDown(): void {
		this.sliderLineDown.emit();
	}

	// Событие прокрутки в слайдере на одну страницу вверх/вниз
	public onSliderClick(event: MouseEvent): void {
		if (this.thumb && this.thumb.nativeElement) {
			const { left, top } = MathHelper.getOffsetElement(
				document.body,
				this.thumb.nativeElement
			);
			const len = this.isVertical ? top : left;
			const point = this.isVertical ? event.clientY : event.clientX;
			const offset = point - len;
			if (offset < 0) {
				this.sliderPageUp.emit();
			} else if (offset > this.thumbSize) {
				this.sliderPageDown.emit();
			}
		}
	}

	// --------------------------------------------------------------------------
	// Обновить слайдер
	public update(): void {
		this.updateSliderSize();
		this.updateThumbSize();
		this.updateThumbPos();
	}

	// Обновить размер слайдера
	public updateSliderSize(): void {
		if (this.slider && this.slider.nativeElement) {
			const offsetHeight = this.slider.nativeElement.offsetHeight;
			const offsetWidth = this.slider.nativeElement.offsetWidth;
			this.sliderSize = this.isVertical ? offsetHeight : offsetWidth;
			this.sliderCrossSize = this.isVertical ? offsetWidth : offsetHeight;
		}
	}

	// Обновить размер каретки
	public updateThumbSize(): void {
		let size = this.viewport * this.sliderSize;
		size = this.canvas ? size / this.canvas : 0;
		this.thumbSize = MathHelper.clamp(size, this.MIN_THUMB_SIZE, this.sliderSize);
	}

	// Обновить позицию каретки
	public updateThumbPos(): void {
		const maxOffset = MathHelper.clamp(this.canvas - this.viewport);
		const maxPos = this.sliderSize - this.thumbSize;
		const percent = maxOffset ? this.offset / maxOffset : 0;
		this.thumbPos = MathHelper.clamp(percent * maxPos, 0, maxPos);
	}

	// Захват каретки
	public sliderPressed(x: number, y: number): void {
		if (this.thumb && this.thumb.nativeElement) {
			const { left, top } = MathHelper.getOffsetElement(
				document.body,
				this.thumb.nativeElement
			);
			const len = this.isVertical ? top : left;
			const point = this.isVertical ? y : x;
			this.thumbPosRatio = this.thumbSize ? (point - len) / this.thumbSize : 0;
			this.thumbPosStart = len - this.thumbPos;
		}
	}

	// Перемещение каретки
	public sliderMove(x: number, y: number): void {
		const point = this.isVertical ? y : x;
		const thumbOffset = this.thumbPosRatio * this.thumbSize;
		const pos = point - this.thumbPosStart - thumbOffset;
		const maxPos = MathHelper.clamp(this.sliderSize - this.thumbSize);
		this.thumbPos = MathHelper.clamp(pos, 0, maxPos);
		const percent = maxPos ? this.thumbPos / maxPos : 0;
		this.sliderMoved.emit(percent);
	}

	// Убрать обработчики
	public removeEvents(): void {
		if (this.mouseMoveListen) { this.mouseMoveListen(); }
		if (this.mouseUpListen) { this.mouseUpListen(); }
		if (this.touchMoveListen) { this.touchMoveListen(); }
		if (this.touchEndListen) { this.touchEndListen(); }
	}

	// Очистить ссылки на DOM
	public removeLinks(): void {
		this.touchTarget = null;
	}

	// Добавить сенсор
	private addSensor(): void {
		if (this.slider && this.slider.nativeElement) {
			this.resizeSensor = new ResizeSensor(
				this.slider.nativeElement,
				this.update.bind(this)
			);
		}
	}

	// Удалить сенсор
	private removeSensor(): void {
		if (this.resizeSensor) { this.resizeSensor.detach(); }
	}

	// --------------------------------------------------------------------------
	// HOOKS
	// Инициализация
	public ngOnInit(): void {
		this.addSensor();
		this.update();
	}

	// Уничтожение
	public ngOnDestroy(): void {
		this.removeEvents();
		this.removeLinks();
		this.removeSensor();
	}

	// Изменение входных параметров
	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.viewport || changes.canvas) {
			this.update();
		}
		if (changes.offset) {
			this.updateThumbPos();
		}
	}
}
