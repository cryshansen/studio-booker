import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import html2pdf from 'html2pdf.js';

@Component({
  standalone: true,
  selector: 'app-confirmation',
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit{


  firstName = '';
  lastName = '';
  confirmationId = '';
  cart: any[] = [];
  total = 0;

  constructor(private router: Router, private cartService: CartService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state;

    if (state) {
      this.firstName = state['firstName'];
      this.lastName = state['lastName'];
      this.confirmationId = state['confirmationId'];
      this.cart = state['cart'];
      this.total = state['total'];
    }
  }
  ngOnInit() {
    this.cartService.clearCart(); // Clear when confirmation page loads
  }
  printConfirmation() {
    //window.print();
    const element = document.getElementById('pdf-content');
    const opt = {
      margin: 0.5,
      filename: `Booking-${this.confirmationId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      }
    };

    if (element) {
      html2pdf().set(opt).from(element).save();
    }
  }

}
