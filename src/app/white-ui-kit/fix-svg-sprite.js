/**
 * Используется после сборки в svg-sprite.
 * @param path - путь и имя файла (первый аргумент из консоли).
 * Сбрасывает атрибут fill, открывая доступ к управлению заливкой
 * через CSS
 */
var fs = require('fs');
var path = process.argv[2];
if (path) {
	var temp = fs.readFileSync(path, 'utf-8');
	var fillNone = RegExp('fill="none"', 'gi');
	var fillColor = RegExp('fill="[^"]*"', 'gi');
	temp = temp.replace(fillNone, 'fill-opacity="0.0"');
	temp = temp.replace(fillColor, 'fill-opacity="1.0"');
	fs.writeFile(path, temp, function(error) {
		if (error) {
			console.error(error);
		} else {
			console.log('Спрайт готов к использованию');
		}
	});
} else {
	console.error('Файл не найден');
}
