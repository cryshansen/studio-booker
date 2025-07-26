import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { StoreModule, provideStore, MetaReducer } from '@ngrx/store';
import { bookingReducer } from './app/store/bookings/booking.reducer';
import { promoReducer } from './app/store/promocodes/promocodes.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { provideHttpClient } from '@angular/common/http';


// 1. Meta-reducer to sync state to localStorage
export function localStorageSyncReducer(reducer: any): any {
  return localStorageSync({
    keys: ['bookings','promo'], // state slices you want to persist
    rehydrate: true,     // pulls initial state from localStorage
    storage: window.localStorage
  })(reducer);
}

// 2. Register meta-reducers
const metaReducers: MetaReducer[] = [localStorageSyncReducer];



bootstrapApplication(AppComponent, {
  ...appConfig,
   providers:[
      ...appConfig.providers,
      provideStore({ bookings: bookingReducer, promo:promoReducer },{ metaReducers}),
      provideHttpClient(),
    ]
})
  .catch((err) => console.error(err));
