import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking } from '../models/booking';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { locationData } from '../data/location-data';
import { Observable } from 'rxjs';
import { PromoState } from '../store/promocodes/promocodes.reducer';
import { applyPromocode } from '../store/promocodes/promocodes.actions';


type Country = keyof typeof locationData;

@Component({
  standalone:true,
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{
  cartItems: Booking[] = [];
  bookings$: Observable<Booking[]>;
  promo$: Observable<PromoState>;
  promoCode = '';
  promoDiscount = 5; // example flat discount
  total = 0;

  countries = Object.keys(locationData) as Country[];
  states: string[] = [];
  selectedCountry: Country | '' = '';

  constructor( private router: Router, private store: Store<{ bookings: Booking[], promo:PromoState }>) {
    this.bookings$ = this.store.pipe(select('bookings'));
    this.promo$ = this.store.pipe(select('promo'));
  }

  ngOnInit(): void {
    
    this.bookings$.subscribe(bookings => {
        console.log(bookings);
        this.cartItems = bookings;
        const bookingSummary = this.cartItems
          .map(item => {
            const date = item.bdate || '';
            const slot = item.btime || '';
            return `on ${date} (${slot})`;
          })
          .join(', ');
      });
    this.promo$.subscribe(promo =>{
        console.log(promo);
        this.promoCode = promo.code;
        this.promoDiscount = promo.discount;
      });

    this.calculateTotal();

  }


  onCountryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value; 
    this.selectedCountry = selectedValue as Country;
    this.states = locationData[this.selectedCountry] || [];
    
  }

  calculateTotal(): void {
    const sum = this.cartItems.reduce((acc, item) => acc + Number(item.price ?? 0), 0);
    this.total = sum - (this.promoCode === 'EXAMPLECODE' ? this.promoDiscount : 0);
  }

  applyPromoCode(): void {
    
    this.store.dispatch(applyPromocode({ code: this.promoCode, discount: this.promoDiscount }));

    this.calculateTotal();
  }


  onFormChange() {

    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    const firstName = (form.querySelector('#firstName') as HTMLInputElement)?.value || '';
    const lastName = (form.querySelector('#lastName') as HTMLInputElement)?.value || '';
    const email = (form.querySelector('#email') as HTMLInputElement)?.value || '';
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
