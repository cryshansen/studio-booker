import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {


bookings = [
  { studio: 'Studio A - Portrait Room', date: new Date(2025, 7, 10, 14, 0), price: 120 },
  { studio: 'Studio B - Natural Light', date: new Date(2025, 7, 12, 10, 30), price: 95 },
  { studio: 'Studio C - Creative Loft', date: new Date(2025, 7, 15, 17, 0), price: 150 }
];

}
