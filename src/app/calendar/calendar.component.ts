import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { EventClickArg } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';


import { CartService } from '../services/cart.service';
import { ContactPrefillService } from '../services/contact-prefill.service';
import { BookingService } from '../services/booking.service';


@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule, BookingFormComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  studioId!: number;
  studioPrice: number | null = null;
  studioName: string | null = null;
  calendarOptions: any;
  calendarReady:boolean = false;
  selectedDate: string | null = null; 
  selectedEvent: any = null;
  showForm = false;

  @Output() daySelected = new EventEmitter<string>();
  @Output() eventClicked = new EventEmitter<any>();

  daysWithBookings: { [ date: string]: number } = {};

  constructor(private route: ActivatedRoute, private cartService: CartService, private contactPrefill: ContactPrefillService, private bookingService: BookingService) {}

  ngOnInit(): void {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    // Format to 'YYYY-MM-DD'
    const todayString = today.toISOString().split('T')[0];
    const twoDaysLaterString = twoDaysLater.toISOString().split('T')[0];



    this.route.paramMap.subscribe(params => {
      this.studioId = Number(params.get('studioId'));
      console.log('Loaded studio:', this.studioId);
      this.route.queryParamMap.subscribe(queryParams => {
          this.studioPrice = Number(queryParams.get('price'));
          console.log('💰 Price from query:', this.studioPrice);
          this.studioName = queryParams.get('name') || '';
          console.log('🏷️ Name from query:', this.studioName);
      });
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // JS months are 0-based
     
     
      this.bookingService.getBookingsSummary(year, month, this.studioId).subscribe(data => {
        this.daysWithBookings = data;
        console.log('Booking summary:', this.daysWithBookings);
        console.log(typeof Object.keys(this.daysWithBookings)[0]); // should print "string"


          
     

      this.calendarOptions = {
            plugins: [dayGridPlugin, bootstrap5Plugin,interactionPlugin],
            initialView: 'dayGridMonth',
            validRange:{
              start: new Date()
            },
            dayCellDidMount: this.dayCellDidMount.bind(this),
            themeSystem: 'bootstrap5',
            selectable: true,
            selectMirror: true,
            selectHelper: true,
            dateClick: (arg:DateClickArg) => {
              console.log('CLICKED ✅', arg);
            //alert(`You clicked on: ${arg.dateStr}`);
              this.onDaySelected(arg.dateStr);
            },
            eventClick: (arg: EventClickArg) => { 
              console.log('CLICKED ✅', arg);
            // alert(`You clicked on event: ${arg}`);
              this.onEventClicked(arg.event);
            },
            events: [
              { title: `Studio ${this.studioId} Booking A`, date: `${todayString}` }, //'YYYY-MM-DD'
              { title: `Studio ${this.studioId} Booking B`, date: `${twoDaysLaterString}` }
            ],
            
          };
          // ✅ Trigger Angular to render the calendar
          this.calendarReady = true;
      });


    });
  }

  

  colorForDay(count: number): string {
    if (count === 0) return 'bg-white';        // white bg-white border
    if (count <= 2) return 'light-booked'; //green 
    if(count > 2 && count <= 4) return 'medium-booked';  // yellow
    return 'heavy-booked';                      // red
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

// This **must** be a method inside your class
  dayCellDidMount(info: any) {
    console.log(info.date);
    const dateStr = this.formatDate(info.date);
    console.log(dateStr);
    const today = new Date();
    const count = this.daysWithBookings[dateStr] ?? 0;
    console.log(count);
    const isPast = info.date < new Date(today.getFullYear(), today.getMonth(), today.getDate());



    console.log('Available keys:', Object.keys(this.daysWithBookings));
    console.log('Looking for key:', dateStr);
    console.log('Value found:', this.daysWithBookings[dateStr]);



    // Your coloring logic
    if (isPast) {
      info.el.classList.add('past-date');
    } else {
      if(count !=0){
        const className = this.colorForDay(count);
        info.el.classList.add(className);
        //info.el.style.backgroundColor = 'purple';


         if (count <= 2) {
          info.el.style.backgroundColor = '#d4edda'; // green
        } else if (count <= 4) {
          info.el.style.backgroundColor = '#fff3cd'; // yellow
        } else {
          info.el.style.backgroundColor = '#f8d7da'; // red
        }
      }
    }
  }


/** when the day is selected passes data to booking form  */
  onDaySelected(date: string) {
    console.log('🗓 Event date:', date);
    console.log('🗓 Event Price:', this.studioPrice);
    //this fills the value of the contact modal with the actions of the user so its an easier request and we can glean some insight to what they are looking for.-
    //its purpose is for when the cart is not enabled in booker.subdomain.com for demo purposes.
    this.contactPrefill.setPrefill({
      subject: `Booking Inquiry for ${this.studioName} ${date}`,
    });
    this.selectedDate = date;
    this.selectedEvent = null;
    this.showForm = true;
  }
/** when an event is selected passes data and can update in the form */
  onEventClicked(event: any) {
    this.selectedEvent = event;
    this.selectedDate = event.startStr;
    console.log('🗓 Event date:', event.startStr);

    //this fills the value of the contact modal with the actions of the user so its an easier request and we can glean some insight to what they are looking for.-
    //its purpose is for when the cart is not enabled in booker.subdomain.com for demo purposes.
    this.contactPrefill.setPrefill({
      subject: `Booking Inquiry for ${this.studioName} ${event.startStr}`,
    });

    this.showForm = true;
    console.log('🗓 Event clicked:', event.title);
  }
  handleBooking(data: any){
     console.log('🗓 Booking Data:', data);
    this.cartService.addToCart(data);
    this.closeForm();
  }
  closeForm() {
    this.showForm = false;
    this.selectedDate = null;
    this.selectedEvent = null;
  }


}
