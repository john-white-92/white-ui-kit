import { InjectionToken } from '@angular/core';

// Токен конфигурации всплывающего окна
export const POPUP_CONFIG = new InjectionToken<any>('popup-config');

// Токен источника данных всплывающего окна
export const POPUP_DATA = new InjectionToken<any>('popup-data');
