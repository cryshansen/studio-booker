import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ContactPrefillService } from '../services/contact-prefill.service';
import { CartService } from '../services/cart.service';
import { locationData } from '../data/location-data';

type Country = keyof typeof locationData;

@Component({
  standalone:true,
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  cartItems: any[] = [];
  promoCode = '';
  promoDiscount = 5; // example flat discount
  total = 0;

  countries = Object.keys(locationData) as Country[];
  states: string[] = [];
  selectedCountry: Country | '' = '';

  constructor(private cartService: CartService, private router: Router, private contactPrefill:ContactPrefillService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    const bookingSummary = this.cartItems
    .map(item => {
      const studio = item.title || 'Studio';
      const date = item.date || '';
      const slot = item.slot || '';
      return `${studio} on ${date} (${slot})`;
    })
    .join(', ');

    this.contactPrefill.setPrefill({
      //fullname: `${firstName} ${lastName}`,
      subject: `Booking Inquiry for: ${bookingSummary}`,
      message: `Hello, I'm inquiring about the following bookings: ${bookingSummary}`
    });

  }


  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value; 
    this.selectedCountry = selectedValue as Country;
    this.states = locationData[this.selectedCountry] || [];
    
  }

  calculateTotal(): void {
    const sum = this.cartItems.reduce((acc, item) => acc + item.price, 0);
    this.total = sum - (this.promoCode === 'EXAMPLECODE' ? this.promoDiscount : 0);
  }

  applyPromoCode(): void {
    this.calculateTotal();
  }
  onFormChange() {

    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    const firstName = (form.querySelector('#firstName') as HTMLInputElement)?.value || '';
    const lastName = (form.querySelector('#lastName') as HTMLInputElement)?.value || '';
    const email = (form.querySelector('#email') as HTMLInputElement)?.value || '';

    const bookingSummary = this.cartItems
      .map(item => {
        const studio = item.title || 'Studio';
        const date = item.date || '';
        const slot = item.slot || '';
        return `${studio} on ${date} (${slot})`;
      })
      .join(', ');

    this.contactPrefill.setPrefill({
      fullname: `${firstName} ${lastName}`,
      email,
      subject: `Booking Inquiry for: ${bookingSummary}`,
      message: `Hello, I'm inquiring about the following bookings: ${bookingSummary}`
    });

  }

  validateAndSubmit(event: Event) {
    event.preventDefault();

    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }else{

    // Proceed with booking — cart could be submitted to server here
      console.log('✅ Form is valid. Proceeding to confirmation...');
      const confirmationId = 'CONF-' + Math.floor(100000 + Math.random() * 900000);
      const firstName = (form.querySelector('#firstName') as HTMLInputElement).value;
      const lastName = (form.querySelector('#lastName') as HTMLInputElement).value;

      this.router.navigate(['/confirmation'], {
        state: {
          firstName,
          lastName,
          confirmationId,
          cart: this.cartItems,
          total: this.total
        }
      });

    }
  }


}
