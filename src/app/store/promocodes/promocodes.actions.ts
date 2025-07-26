import { createAction, props } from '@ngrx/store';


export const applyPromocode = createAction(
  '[Promo] Add Promocode',
  props<{ code: string; discount:number }>()
);
export const clearPromocode = createAction('[Promo] Clear Code');
