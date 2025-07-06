import { Component, signal, computed, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() selectedDate: string | null = null;
  @Input() eventData: any = null;
  @Output() bookingSubmitted = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventData'] && this.eventData) {
      this.bookingForm.patchValue({
        title: this.eventData.title || '',
        date: this.eventData.date || '',
        slot: this.eventData.slot || '',
      });
      this.selectedSlot.set(this.eventData.slot || null);
    } else if (changes['selectedDate'] && this.selectedDate) {
      // Reset form for new booking
      this.bookingForm.reset();
      this.bookingForm.get('date')?.setValue(this.selectedDate);
      this.selectedSlot.set(null);
    }
  }
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
       this.bookingSubmitted.emit(this.bookingForm.value);
    }
  }

  isSlotSelected = (slot: string) =>
    computed(() => this.selectedSlot() === slot);
}
