import { Component } from '@angular/core';
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
  calendarOptions = {
    plugins: [dayGridPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    themeSystem: 'bootstrap5',
    events: [
      { title: 'Booking A', date: '2025-07-08' },
      { title: 'Booking B', date: '2025-07-10' }
    ]
  };
}
