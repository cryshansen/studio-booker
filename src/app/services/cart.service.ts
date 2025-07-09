import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private storageKey = 'studio-cart';

 constructor() {
    // On service init, try to load from localStorage
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      this.cartItems = JSON.parse(saved);
    }
  }


  addToCart(item: any) {
    this.cartItems.push(item);
    this.saveToStorage();
    console.log('🛒 Added to cart:', item);
  }

  getCartItems(): any[] {
    return [...this.cartItems]; // prevent mutation
  }

  clearCart() {
    this.cartItems = [];
    localStorage.removeItem(this.storageKey);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

}
