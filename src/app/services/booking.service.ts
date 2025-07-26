// booking.service.ts
import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; //scans the classes to inject the service at runtime to provide access just like the java class
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';
import { Slot } from '../models/slot';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getBookingsSummary(year: number, month: number, studioId: number): Observable<any> {
    console.log(studioId + '<-- studio --> ' + year +'-'+month.toString().padStart(2, '0'));
    return this.http.get(`https://crystalhansenartographic.com/api/index-booking.php/booking/monthStudios?year=${year}&month=${month.toString().padStart(2, '0')}&id=${studioId}`);
  }

  getAvailableSlots(studioId: number, date: string): Observable<Slot[]>{
    const params = new HttpParams()
    .set('studioId', studioId.toString())
    .set('date', date);

    return this.http.get<Slot[]>(`https://crystalhansenartographic.com/api/index-booking.php/booking/listDay`, {params});
  }

}
