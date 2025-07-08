import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { EventClickArg } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';


@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  studioId!: number;
  calendarOptions: any;
  @Output() daySelected = new EventEmitter<string>();
  @Output() eventClicked = new EventEmitter<any>();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.studioId = Number(params.get('studioId'));
      console.log('Loaded studio:', this.studioId);

      this.calendarOptions = {
        plugins: [dayGridPlugin, bootstrap5Plugin,interactionPlugin],
        initialView: 'dayGridMonth',
        themeSystem: 'bootstrap5',
        selectable: true,
        selectMirror: true,
        selectHelper: true,
        dateClick: (arg:DateClickArg) => {
          console.log('CLICKED ✅', arg);
          alert(`You clicked on: ${arg.dateStr}`);
        },
        eventClick: (arg: EventClickArg) => { 
          console.log('CLICKED ✅', arg);
          alert(`You clicked on event: ${arg}`);
        },
        events: [
          { title: `Studio ${this.studioId} Booking A`, date: '2025-07-08' },
          { title: `Studio ${this.studioId} Booking B`, date: '2025-07-10' }
        ],
        
      };
    });
  }

  handleDateClick(arg: DateClickArg) {
    console.log('✅ Date clicked:', arg.dateStr);
  }

  handleEventClick(arg: EventClickArg) {
    console.log('🗓 Event clicked:', arg.event.title);
  }
}
