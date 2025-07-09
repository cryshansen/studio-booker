import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CartService } from '../services/cart.service';



@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
 cartItems: any[] = [];

  constructor(private cartService: CartService) {}
  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    console.log('🛒 Cart contents:', this.cartItems);
  }
  
 remove(index:number){
  console.log(index);
  this.cartService.removeItem(index);
  this.cartItems = this.cartService.getCartItems(); // refresh after removal
 }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price || 0), 0);
  }


}
