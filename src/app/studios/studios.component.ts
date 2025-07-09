import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SpinnerComponent } from '../spinner/spinner.component';

interface Studio {
  studioId: number;
  studioName: string;
  studioDescription: string;
  studioSizeSq: number;
  studioAvailability: number;
  studioAccessories: string;
  price: number;
}

@Component({
  standalone: true,
  selector: 'app-studios',
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './studios.component.html',
  styleUrl: './studios.component.css'
})
export class StudiosComponent implements OnInit  {
  loading = true;
 
  studios: Studio[] = [];
  studios1: Studio[] = [
    {
      studioId: 1,
      studioName: 'Studio A - Portrait Room',
      studioDescription: 'Ideal for headshots and portrait sessions.',
      studioSizeSq: 400,
      studioAvailability: 1,
      studioAccessories: 'Backdrops, Lighting Kit',
      price: 120
    },
    {
      studioId: 2,
      studioName: 'Studio B - Natural Light',
      studioDescription: 'Perfect for lifestyle and fashion shoots.',
      studioSizeSq: 550,
      studioAvailability: 1,
      studioAccessories: 'Full Window Wall, Reflectors',
      price: 150
    },
    {
      studioId: 3,
      studioName: 'Studio C - Creative Loft',
      studioDescription: 'Loft-style creative space with props.',
      studioSizeSq: 600,
      studioAvailability: 0,
      studioAccessories: 'Props, Seamless Background',
      price: 130
    }
  ];
   constructor(private router: Router) {}

ngOnInit() {
  // Simulate fetch delay (replace with real API call)
  setTimeout(() => {
    this.studios = this.studios1;
    this.loading = false;
  }, 1000);
}
  bookStudio(id: number,price: number, name: string) {
    console.log('Booking studio with ID:', id);
    console.log('Booking studio price:', price);
    console.log('Booking studio name:', name);
    this.router.navigate(['/calendar', id ],{ queryParams: { price, name } } );
    // Navigate or store ID for booking here
  }



}
