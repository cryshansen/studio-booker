import { Component, signal, computed, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as BookingActions from '../store/bookings/booking.actions';
import { Booking } from '../models/booking';


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
  @Input() price: number | null = null;
  //gets the price from the url and sets here
  @Input() studioPrice: number | null = null;

  @Output() formClosed = new EventEmitter<void>();

   availableSlots = signal([
    { start: '08:00 AM', end: '10:00 AM', price: '$90', available: true },
    { start: '10:00 AM', end: '12:00 PM', price: '$90', available: true },
    { start: '12:00 PM', end: '14:00 PM', price: '$120', available: false },
    { start: '14:00 PM', end: '16:00 PM', price: '$140', available: false },
    { start: '16:00 PM', end: '18:00 PM', price: '$160', available: false },
    { start: '18:00 PM', end: '20:00 PM', price: '$180', available: false },
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['studioPrice'] && this.studioPrice !== null) {
      console.log("OnChange",this.studioPrice);
      this.bookingForm.get('price')?.setValue(this.studioPrice);
      this.availableSlots.set([
        { start: '08:00 AM', end: '10:00 AM', price: `$${this.studioPrice}`, available: true },
        { start: '10:00 AM', end: '12:00 PM', price: `$${this.studioPrice}`, available: true },
        { start: '12:00 PM', end: '14:00 PM', price: `$${this.studioPrice}`, available: false },
        { start: '14:00 PM', end: '16:00 PM', price: `$${this.studioPrice}`, available: false },
        { start: '16:00 PM', end: '18:00 PM', price: `$${this.studioPrice}`, available: true },
        { start: '18:00 PM', end: '20:00 PM', price: `$${this.studioPrice}`, available: true },
      ]);
    }

    if (changes['eventData'] && this.eventData) {
      this.bookingForm.patchValue({
        title: this.eventData.title || '',
        date: this.eventData.startStr || '',
        slot: this.eventData.slot || '',
        price: this.eventData.price || '',
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
    if(this.studioName != null){
      this.bookingForm.get('title')?.setValue(this.studioName);
    }
    if(this.studioPrice != null){
      this.bookingForm.get('price')?.setValue(this.studioPrice);
    }
    
  }
 

  selectedSlot = signal<string | null>(null);
  bookingForm: FormGroup;

  constructor(private fb: FormBuilder, private store:Store) {
    console.log("Constructor", this.studioPrice); //null
    this.bookingForm = this.fb.group({
      title: '',
      date: ['', Validators.required],
      slot: ['', Validators.required],
      studioId: [this.studioId],
      price: [this.price]
    });
  }



  
  selectSlot(slot: string) {
    this.selectedSlot.set(slot);
    this.bookingForm.get('slot')?.setValue(slot);
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      const formValues = this.bookingForm.value;
      const booking: Booking = {
        ...formValues,
        id: Date.now() + Math.floor(Math.random() * 10000),
        bdate: formValues.date,
        btime: formValues.slot,
        studioName: formValues.title,
        studioId: formValues.studioId,
        price: formValues.price
      };

      console.log("Booking Submitted:", booking);
      this.store.dispatch(BookingActions.addBooking({booking}));
      this.formClosed.emit();

    }
  }

  isSlotSelected = (slot: string) =>  computed(() => this.selectedSlot() === slot);


}
