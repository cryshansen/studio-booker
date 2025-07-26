import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';
import { removeBooking,clearBookings } from '../store/bookings/booking.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  bookings$: Observable<Booking[]>;

  constructor(private store: Store<{ bookings: Booking[] }>) {
    this.bookings$ = store.pipe(
      select('bookings'),
      tap( bookings =>{
        console.log("Updating Bookings", bookings);
        localStorage.setItem('bookings',JSON.stringify(bookings))
      })
    );
  }
  ngOnInit() {
   
  }
  clearCart(){
    this.store.dispatch(clearBookings());
  }
  remove(id: number): void {
    console.log("Remove id ",id)
    this.store.dispatch(removeBooking({ id }));
    
  }
}
