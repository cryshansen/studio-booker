import { createReducer, on } from '@ngrx/store';
import { applyPromocode, clearPromocode } from './promocodes.actions';

export interface PromoState{
  code: string;
  discount: number;
}

const initialState: PromoState = { code:'', discount:0, };

export const promoReducer = createReducer(
  initialState,
  on(applyPromocode, (state, {code,discount} ) => ({code, discount}) ),
  on(clearPromocode, () => initialState)
);