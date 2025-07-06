import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, CalendarComponent, BookingFormComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
 selectedDate: string | null = null;
  selectedEvent: any = null;
  showForm = false;

  onDaySelected(date: string) {
    this.selectedDate = date;
    this.selectedEvent = null;
    this.showForm = true;
  }

  onEventClicked(event: any) {
    this.selectedEvent = event;
    this.selectedDate = event.date;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.selectedDate = null;
    this.selectedEvent = null;
  }
  
}
