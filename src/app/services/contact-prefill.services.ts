import { TestBed } from '@angular/core/testing';
import { ContactPrefillService } from './contact-prefill.service';

describe('ContactPrefillService', () => {
  let service: ContactPrefillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactPrefillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and return prefill data', () => {
    service.setPrefill({ email: 'test@example.com', subject: 'Hello', fullname: 'Crystal Hansen' });
    const result = service.getPrefill();
    expect(result.email).toBe('test@example.com');
    expect(result.subject).toBe('Hello');
  });

  it('should clear signals', () => {
    service.setPrefill({fullname:'John'});
    service.clear();
    expect(service.getPrefill()).toBeUndefined();
  });
});
