import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as BookingActions from '../store/bookings/booking.actions';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: any[] = [];
  private storageKey = 'studio-cart';

 constructor(private store:Store<{cart: any[] }>) {
    // On service init, try to load from localStorage
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.cartItems = JSON.parse(saved);
      this.store.dispatch(BookingActions.loadBookings({items:this.cartItems}));
    }
  }


  addToCart(item: any) {
    this.cartItems.push(item);
    this.saveToStorage();
    console.log('🛒 Added to cart:', item);
    this.store.dispatch(BookingActions.addBooking(item));
  
  }

  getCartItems(): any[] {
    return [...this.cartItems]; // prevent mutation
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem(this.storageKey);
    this.store.dispatch(BookingActions.clearBookings());
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveToStorage();
    this.store.dispatch(BookingActions.removeBooking({id: index}));
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

}
