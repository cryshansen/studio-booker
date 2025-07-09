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
  @Input() studioId: number | null = null;
  @Input() studioName: string | null = null;
  @Input() studioPrice: number | null = null;
  @Output() bookingSubmitted = new EventEmitter<any>();
  @Output() formClosed = new EventEmitter<void>();

   availableSlots = signal([
    { start: '08:00 AM', end: '10:00 AM', price: '$90', available: true },
    { start: '10:00 AM', end: '12:00 PM', price: '$90', available: true },
    { start: '12:00 PM', end: '2:00 PM', price: '$90', available: false },
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['studioPrice'] && this.studioPrice !== null) {
      this.bookingForm.get('studioPrice')?.setValue(this.studioPrice);
      this.availableSlots.set([
        { start: '08:00 AM', end: '10:00 AM', price: `$${this.studioPrice}`, available: true },
        { start: '10:00 AM', end: '12:00 PM', price: `$${this.studioPrice}`, available: true },
        { start: '12:00 PM', end: '2:00 PM', price: `$${this.studioPrice}`, available: false },
      ]);
    }

    if (changes['eventData'] && this.eventData) {
      this.bookingForm.patchValue({
        title: this.eventData.title || '',
        date: this.eventData.startStr || '',
        slot: this.eventData.slot || '',
      });
      this.selectedSlot.set(this.eventData.slot || null);
    } else if (changes['selectedDate'] && this.selectedDate) {
      // Reset form for new booking
      this.bookingForm.reset();
      this.bookingForm.get('date')?.setValue(this.selectedDate);
      this.selectedSlot.set(null);
    }
    if (this.studioId !== null) {
      this.bookingForm.get('studioId')?.setValue(this.studioId);
    }
    
  }
 

  selectedSlot = signal<string | null>(null);

  bookingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookingForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      slot: ['', Validators.required],
      studioId: [this.studioId],
      price: [this.studioPrice]
    });
  }



  
  selectSlot(slot: string) {
    this.selectedSlot.set(slot);
    this.bookingForm.get('slot')?.setValue(slot);
  }

  onSubmit() {
    if (this.bookingForm.valid) {
     
       const formValue = {
        ...this.bookingForm.value,
        studioName: this.studioName,
        studioId: this.studioId,
        price: this.studioPrice
      };
       console.log("Booking Submitted:", formValue);
       this.bookingSubmitted.emit(formValue);
    }
  }

  isSlotSelected = (slot: string) =>
    computed(() => this.selectedSlot() === slot);





}
