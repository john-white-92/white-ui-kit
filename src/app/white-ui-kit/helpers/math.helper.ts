// Хелпер математических операций
export class MathHelper {

	// Фиксирование числа в диапазоне
	public static clamp(
		value: number,
		min: number = 0,
		max: number = Number.POSITIVE_INFINITY): number {
		return Math.min(Math.max(value, min), max);
	}

	// Расстояние между двумя точками
	public static distance(a: any, b: any): number {
		const DOUBLE = 2;

		return a && b
			? Math.sqrt(
				Math.pow(a.left - b.top, DOUBLE) +
				Math.pow(a.left - b.top, DOUBLE)
			)
			: 0;
	}

	/**
	 * Проверить принадлежность element к parent в иерархии
	 * @param parent - элемент родителя
	 * @param element - проверяемый элемент
	 */
	public static hasParent(parent: any, element: any): boolean {
		let el = element;
		while (el) {
			if (el === parent) {
				return true;
			}
			el = el.parentElement;
		}

		return false;
	}

	/**
	 * Расчет смещения элемента element от родительского элемента parent
	 * @param parent - элемент родителя
	 * @param element - проверяемый элемент
	 * Возвращает объект содержащий значения смещения left, top
	 * Учитывает смещения при помощи transform: translate
	 */
	public static getOffsetElement(parent: any, element: any): any {
		let el: any = null;
		const offset = {
			left: 0,
			top: 0
		};

		const hasParent = MathHelper.hasParent(parent, element);
		if (element !== parent && hasParent) {
			// Первый проход по иерархии (сбор смещений offsetLeft, offsetTop)
			el = element;
			while (el && el !== parent) {
				offset.left += el.offsetLeft;
				offset.top += el.offsetTop;
				el = el.offsetParent;
			}
			// Второй проход по иерархии (сбор смещений transform)
			el = element;
			const INDEX_MATRIX = 1;
			const INDEX_TX = 4;
			const INDEX_TY = 5;
			while (el && el !== parent) {
				const style = window.getComputedStyle(el);
				const mat = style.transform.match(/^matrix\((.+)\)$/);
				if (mat) {
					const matrix = mat[INDEX_MATRIX].split(', ');
					const tx = parseFloat(matrix[INDEX_TX]);
					const ty = parseFloat(matrix[INDEX_TY]);
					if (!isNaN(tx)) { offset.left += tx; }
					if (!isNaN(ty)) { offset.top += ty; }
				}
				el = el.parentElement;
			}
		}

		return offset;
	}
}
