import { Component,ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


import { HeaderComponent } from './header/header.component'; // or correct path
import { SpinnerComponent } from './spinner/spinner.component';
import { ContactModalComponent } from './contact-modal/contact-modal.component';



@Component({
  standalone:true,
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet,HeaderComponent,SpinnerComponent, ContactModalComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loading = false;
  title = 'Studio Booker';

  @ViewChild('contactModal') contactModalComponent!: ContactModalComponent;

  openContactModal() {
    this.contactModalComponent.show();
  }
  
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }


}
