import { Routes } from '@angular/router';
import { BookingFormComponent } from  './booking-form/booking-form.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
      { path: '', component: BookingFormComponent },
      { path: 'calendar', component: CalendarComponent }
];
