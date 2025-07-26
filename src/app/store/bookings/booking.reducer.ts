import { createReducer, on } from '@ngrx/store';
import { addBooking, removeBooking, clearBookings, loadBookings } from './booking.actions';
import { Booking } from '../../models/booking';
export const initialState: Booking[] = [];

export const bookingReducer = createReducer(
  initialState,
  on(addBooking, (state, { booking }) => [...state, booking]),
  on(removeBooking, (state, { id }) => { console.log("Removed Id from state", id); return state.filter(b => b.id !== id)}),
  on(loadBookings, (_, {items})=>[...items]),
  on(clearBookings, () => [])
);
