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
  selectedDate: string | null = null; 
  selectedEvent: any = null;
  showForm = false;

  @Output() daySelected = new EventEmitter<string>();
  @Output() eventClicked = new EventEmitter<any>();



  constructor(private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.studioId = Number(params.get('studioId'));
      console.log('Loaded studio:', this.studioId);
      this.route.queryParamMap.subscribe(queryParams => {
          this.studioPrice = Number(queryParams.get('price'));
          console.log('💰 Price from query:', this.studioPrice);
          this.studioName = queryParams.get('name') || '';
          console.log('🏷️ Name from query:', this.studioName);
      });
      
      this.calendarOptions = {
        plugins: [dayGridPlugin, bootstrap5Plugin,interactionPlugin],
        initialView: 'dayGridMonth',
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
          { title: `Studio ${this.studioId} Booking A`, date: '2025-07-08' },
          { title: `Studio ${this.studioId} Booking B`, date: '2025-07-10' }
        ],
        
      };
    });
  }

/** when the day is selected passes data to booking form  */
  onDaySelected(date: string) {
    console.log('🗓 Event date:', date);
    this.selectedDate = date;
    this.selectedEvent = null;
    this.showForm = true;
  }
/** when an event is selected passes data and can update in the form */
  onEventClicked(event: any) {
    this.selectedEvent = event;
    this.selectedDate = event.startStr;
    console.log('🗓 Event date:', event.startStr);
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
