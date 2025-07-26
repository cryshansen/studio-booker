import { createAction, props } from '@ngrx/store';
import { Booking } from '../../models/booking';

export const addBooking = createAction(
  '[Booking] Add Booking',
  props<{ booking: Booking }>()
);

export const removeBooking = createAction(
  '[Booking] Remove Booking',
  props<{ id: number }>()
);

export const loadBookings = createAction('[Cart] Load Bookings from Storage', props<{ items: any[] }>());

export const clearBookings = createAction('[Booking] Clear All');
