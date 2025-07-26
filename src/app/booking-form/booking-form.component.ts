import { Component, signal, computed, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as BookingActions from '../store/bookings/booking.actions';
import { Booking } from '../models/booking';
import { Slot } from '../models/slot';
import { BookingService } from '../services/booking.service';


@Component({
  standalone: true,
  selector: 'app-booking-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: 'booking-form.component.css'
})
export class BookingFormComponent {
   // -------- INPUTS (passed in from parent component, e.g. calendar) --------
  @Input() selectedDate: string | null = null;
  @Input() eventData: any = null;
  @Input() studioId: number | null = null;
  @Input() studioName: string | null = null;
  @Input() price: number | null = null;
  //gets the price from the url and sets here
  @Input() studioPrice: number | null = null;

  // -------- OUTPUTS (emit events back to parent component) --------
  @Output() formClosed = new EventEmitter<void>();

  // -------- SIGNALS --------
  // Reactive list of time slots available for booking on the selected day
   /*availableSlots = signal([
    { start: '08:00 AM', end: '10:00 AM', price: '$90', available: true },
    { start: '10:00 AM', end: '12:00 PM', price: '$90', available: true },
    { start: '12:00 PM', end: '14:00 PM', price: '$120', available: false },
    { start: '14:00 PM', end: '16:00 PM', price: '$140', available: false },
    { start: '16:00 PM', end: '18:00 PM', price: '$160', available: false },
    { start: '18:00 PM', end: '20:00 PM', price: '$180', available: false },
  ]);*/
   availableSlots = signal<Slot[]>([]);

  // Signal that tracks which time slot is currently selected by the user
  selectedSlot = signal<string | null>(null);
   // -------- FORM GROUP --------
  bookingForm: FormGroup;


  constructor(private fb: FormBuilder, private store:Store, private bookingService:BookingService) {
     // Form initialization
    console.log("Constructor", this.studioPrice); // This will be null at first
    this.bookingForm = this.fb.group({
      title: '',                              // Title of the booking, often studio name
      date: ['', Validators.required],        // Date of the booking, required field
      slot: ['', Validators.required],        // Selected time slot, required
      studioId: [this.studioId],              // Studio ID tied to the booking
      price: [this.price]                     // Price of the booking
    });


  }

  // -------- LIFECYCLE HOOK --------
  ngOnChanges(changes: SimpleChanges): void {

     // When studioPrice changes (i.e. when selected studio is set), update price and slot list
    if (changes['studioPrice'] && this.studioPrice !== null) {
      console.log("OnChange",this.studioPrice);
      this.bookingForm.get('price')?.setValue(this.studioPrice);
      // Update time slots using the new studio price
      this.availableSlots.set([
        { start: '08:00 AM', end: '10:00 AM', price: `$${this.studioPrice}`, available: true },
        { start: '10:00 AM', end: '12:00 PM', price: `$${this.studioPrice}`, available: true },
        { start: '12:00 PM', end: '14:00 PM', price: `$${this.studioPrice}`, available: false },
        { start: '14:00 PM', end: '16:00 PM', price: `$${this.studioPrice}`, available: false },
        { start: '16:00 PM', end: '18:00 PM', price: `$${this.studioPrice}`, available: true },
        { start: '18:00 PM', end: '20:00 PM', price: `$${this.studioPrice}`, available: true },
      ]);
    }
    // When eventData is passed (e.g. from editing an existing booking), prefill the form
    if (changes['eventData'] && this.eventData) {
      this.bookingForm.patchValue({
        title: this.eventData.title || '',
        date: this.eventData.startStr || '',
        slot: this.eventData.slot || '',
        price: this.eventData.price || '',
      });
      this.selectedSlot.set(this.eventData.slot || null);
     
    } 
    // If the selectedDate changes (new booking from calendar click), reset form

    else if (changes['selectedDate'] && this.selectedDate) {
      // Reset form for new booking
      this.bookingForm.reset();
      this.bookingForm.get('date')?.setValue(this.selectedDate);
      this.selectedSlot.set(null);
      this.fetchSlots();
    }
        // Always make sure studioId is in the form when available
    if (this.studioId !== null) {
      this.bookingForm.get('studioId')?.setValue(this.studioId);
    }
     // Set the studio name as booking title if provided
    if(this.studioName != null){
      this.bookingForm.get('title')?.setValue(this.studioName);
    }
     // Set price from studioPrice if it changes later
    if(this.studioPrice != null){
      this.bookingForm.get('price')?.setValue(this.studioPrice);
    }
    
  }

  /**
   * ✅ Fetch time slots from the backend for the current studio and date.
   */
  fetchSlots(): void {
    if (this.studioId && this.selectedDate) {
      this.bookingService.getAvailableSlots(this.studioId, this.selectedDate)
        .subscribe({
          next: (slots) => {
            this.availableSlots.set(slots); // ✅ update signal with fetched slots
          },
          error: (err) => {
            console.error('Error fetching slots:', err);
            this.availableSlots.set([]); // fallback to empty
          }
        });
    }
  }
  // -------- SLOT SELECTION HANDLER --------
  // Called when a user selects a time slot
  selectSlot(slot: string) {
    this.selectedSlot.set(slot);                      // Reactive signal update
    this.bookingForm.get('slot')?.setValue(slot);     // Sync with form control
  }

  // Helper method to check if a slot is the one currently selected
  // Used in the template for active button/highlight styles
  isSlotSelected = (slot: string) =>  computed(() => this.selectedSlot() === slot);


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
  
}
