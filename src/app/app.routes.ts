import { Routes } from '@angular/router';
import { BookingFormComponent } from  './booking-form/booking-form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { CartComponent } from './cart/cart.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CheckoutComponent } from './checkout/checkout.component'; 
import { StudiosComponent } from './studios/studios.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ResetpasswordFormComponent } from './resetpassword-form/resetpassword-form.component';

export const routes: Routes = [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'calendar/:studioId', component: CalendarComponent },
      { path: 'booking', component: BookingFormComponent },
      { path: 'signup',  component: SignupComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'confirmation',  component: ConfirmationComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout',  component: CheckoutComponent },
      { path: '', component: StudiosComponent },
      { path: 'verify', component:VerifyComponent},
      { path: 'passwordreset',component:ResetpasswordComponent},
      { path: 'resetpassword',component:ResetpasswordFormComponent}

];
