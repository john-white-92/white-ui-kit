import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
	HitButtonComponent,
	HitCalendarComponent,
	HitCheckboxComponent,
	HitContextPopupComponent,
	HitDatepickerComponent,
	HitDatepickerPopupComponent,
	HitInputComponent,
	HitScrollComponent,
	HitSliderComponent,
	HitSvgComponent
} from './components';

import {
	HitDateMaskDirective
} from './directives';

import {
	HitContextOverlayService,
	HitScrollService
} from './services';

// Модуль white-ui-kit
@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		OverlayModule
	],
	declarations: [
		HitButtonComponent,
		HitCalendarComponent,
		HitCheckboxComponent,
		HitContextPopupComponent,
		HitDatepickerComponent,
		HitDatepickerPopupComponent,
		HitInputComponent,
		HitScrollComponent,
		HitSliderComponent,
		HitSvgComponent,
		HitDateMaskDirective
	],
	exports: [
		HitButtonComponent,
		HitCalendarComponent,
		HitCheckboxComponent,
		HitContextPopupComponent,
		HitDatepickerComponent,
		HitDatepickerPopupComponent,
		HitInputComponent,
		HitScrollComponent,
		HitSliderComponent,
		HitSvgComponent,
		HitDateMaskDirective
	],
	entryComponents: [
		HitContextPopupComponent,
		HitDatepickerPopupComponent
	]
})
export class WhiteUiKitModule {
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: WhiteUiKitModule,
			providers: [
				HitContextOverlayService,
				HitScrollService
			]
		};
	}
}
