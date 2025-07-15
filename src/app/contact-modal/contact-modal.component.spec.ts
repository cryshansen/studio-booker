import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactModalComponent } from './contact-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactPrefillService } from '../services/contact-prefill.service';

describe('ContactModalComponent', () => {
  let component: ContactModalComponent;
  let fixture: ComponentFixture<ContactModalComponent>;
  let contactService: ContactPrefillService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ContactModalComponent],
      declarations: [ContactModalComponent],
      providers: [ContactPrefillService]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactModalComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactPrefillService);

   // contactService.setPrefill({ email: 'demo@example.com', subject: 'Test Subject' });
    //fixture.detectChanges();
  });


  it('should prefill form values from service', () => {
    contactService.setPrefill({
      email: 'test@example.com',
      message: 'Hello!',
      subject: 'Booking Info',
    });

    component.ngOnInit();
    expect(component.contactForm.get('email')?.value).toBe('test@example.com');
    expect(component.contactForm.get('textbox_msg')?.value).toBe('Hello!');
    expect(component.contactForm.get('subject')?.value).toBe('Booking Info');
  
  });

  it('should show error if form is invalid on submit', () => {
    component.contactForm.reset(); // Make form invalid
    component.submitForm();
    expect(component.error).toBe('Please fill all required fields.');
  });
});
