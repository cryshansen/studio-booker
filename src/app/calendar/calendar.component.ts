import { Component, Output, EventEmitter } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  @Output() daySelected = new EventEmitter<string>();
  @Output() eventClicked = new EventEmitter<any>();

   calendarOptions = {
    plugins: [dayGridPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap5',
    events: [
      { title: 'Booking A', date: '2025-07-08' },
      { title: 'Booking B', date: '2025-07-10' }
    ],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  handleDateClick(arg: any) {
    this.daySelected.emit(arg.dateStr); // emits "YYYY-MM-DD"
  }

  handleEventClick(arg: any) {
    const eventData = {
      title: arg.event.title,
      date: arg.event.startStr,
      id: arg.event.id
    };
    this.eventClicked.emit(eventData);
  }
}
