// Хелпер событий
export class EventHelper {

	/**
	 * Получить путь из Node по событию
	 * @param event - событие
	 */
	public static path(event: MouseEvent | any): Node[] {
		const target = event.target || event.srcElement || event.currentTarget;
		const composedPath = event.composedPath && event.composedPath();
		const path = composedPath || event.path;

		if (path) {
			// Safari fix
			return (path.indexOf(window) === -1)
				? path.concat(window)
				: path;
		}

		const getParents = (node: Node, memo: Node[] = []): Node[] => (
			node.parentNode
				? getParents(node.parentNode, memo.concat(node.parentNode))
				: memo
			);

		return [target].concat(getParents(target), window);
	}
}
