# WHITE-UI-KIT

Модуль компонентов UI
Имя модуля: `white-ui-kit`

## Содержимое

Компоненты:
  - `hit-button` - кнопка
  - `hit-calendar` - календарь
  - `hit-checkbox` - флаг
  - `hit-datepicker` - поле ввода даты
  - `hit-input` - поле ввода
  - `hit-scroll` - область с прокруткой
  - `hit-slider` - слайдер прокрутки
  - `hit-svg` - спрайт SVG иконок

## Установка

```sh
$ npm install white-ui-kit --save
```

## Использование

В `app.module.ts` импортируем и добавляем в импорт модуля
```ts
import { WhiteUiKitModule } from 'white-ui-kit/white-ui-kit.module';
...
@NgModule({
    imports: [
        ...
        WhiteUiKitModule.forRoot(),
        ...
    ]
```
В `app.component.html` используем компонент
```html
<hit-svg></hit-svg>
```
