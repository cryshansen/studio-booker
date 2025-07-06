import { Routes } from '@angular/router';
import { BookingFormComponent } from  './booking-form/booking-form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'

export const routes: Routes = [
      { path: '', component: AdminDashboardComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'booking', component: BookingFormComponent }
];
