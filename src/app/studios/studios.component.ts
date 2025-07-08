import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-studios',
  imports: [CommonModule],
  templateUrl: './studios.component.html',
  styleUrl: './studios.component.css'
})
export class StudiosComponent {
  constructor(private router: Router) {}
  studios = [
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

  bookStudio(id: number) {
  console.log('Booking studio with ID:', id);
  this.router.navigate(['/calendar', id]);
  // Navigate or store ID for booking here
}



}
