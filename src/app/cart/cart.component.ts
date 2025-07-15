import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CartService } from '../services/cart.service';
import { ContactPrefillService } from '../services/contact-prefill.service';



@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
 cartItems: any[] = [];

  constructor(private cartService: CartService, private contactPrefill:ContactPrefillService) {}
  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    console.log('🛒 Cart contents:', this.cartItems);
     const bookingSummary = this.cartItems.map(item => {
      const studio = item.title || 'Studio';
      const date = item.date || '';
      const slot = item.slot || '';
      return `${studio} on ${date} (${slot})`;
    })
    .join(', ');

    this.contactPrefill.setPrefill({ 
        subject: `Booking Inquiry for: ${bookingSummary}`,
        message: `Hello, I'm inquiring about the following bookings: ${bookingSummary}`
    });
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
