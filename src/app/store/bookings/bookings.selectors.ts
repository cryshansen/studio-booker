import { createSelector } from "@ngrx/store";
import { Booking } from "../../models/booking"; 


export const selectBookings = (state: {bookings:Booking[]}) => state.bookings;


export const selectTotalPrice = createSelector(
    selectBookings,
    (bookings: Booking[]) => bookings.reduce((total,item) => total + ( Number(item.price) || 0),0 )
);
