import { Component, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-booking-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: 'booking-form.component.css'
})
export class BookingFormComponent {
  availableSlots = signal([
    { start: '08:00 AM', end: '10:00 AM', price: '$90', available: true },
    { start: '10:00 AM', end: '12:00 PM', price: '$90', available: true },
    { start: '12:00 PM', end: '2:00 PM', price: '$90', available: false },
  ]);

  selectedSlot = signal<string | null>(null);

  bookingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      slot: ['', Validators.required],
    });
  }

  selectSlot(slot: string) {
    this.selectedSlot.set(slot);
    this.bookingForm.get('slot')?.setValue(slot);
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      console.log("Booking Submitted:", this.bookingForm.value);
    }
  }

  isSlotSelected = (slot: string) =>
    computed(() => this.selectedSlot() === slot);
}
