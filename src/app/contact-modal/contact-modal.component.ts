import { Component, OnInit, ElementRef, ViewChild , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { ContactPrefillService } from '../services/contact-prefill.service';

@Component({
  standalone:true,
  selector: 'app-contact-modal',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact-modal.component.html',
  styleUrl: './contact-modal.component.css'
})
export class ContactModalComponent {
  contactForm: FormGroup;
  message = '';
  error = '';
  captchaReady = true; // assume ready (for mock)
  captchaToken: string = '';

  
  @ViewChild('modalElement', { static: true }) modalElement!: ElementRef;

  constructor(private fb: FormBuilder, private contactPrefill: ContactPrefillService) {
    this.contactForm = this.fb.group({
      fullname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      textbox_msg: ['', Validators.required]
    });
  }

  ngOnInit() {
    const prefill = this.contactPrefill.getPrefill();
    this.contactForm.patchValue({
      fullname: prefill.fullname || '',
      email: prefill.email || '',
      subject: prefill.subject || '',
      textbox_msg: prefill.message || ''
    });
  }

  show() {
    if(!this.modalElement){
      console.log("modal element not ready");
      return;
    }
    const prefill = this.contactPrefill.getPrefill();
    this.contactForm.patchValue({
      fullname: prefill.fullname || '',
      email: prefill.email || '',
      textbox_msg: prefill.message || '',
      subject: prefill.subject || ''
    });
    const modal = new Modal(this.modalElement.nativeElement);
    modal.show();
  }

  submitForm() {
    this.error = '';
    this.message = '';

    if (!this.contactForm.valid) {
      this.error = 'Please fill all required fields.';
      return;
    }

    // For demo: fake captcha token
    const payload = {
      ...this.contactForm.value,
      gctoken: 'demo-token-abc123'
    };

    fetch('https://crystalhansenartographic.com/api/index-contact.php/contact/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(result => {
      this.message = result.message || 'Thanks for contacting us!';
      this.contactForm.reset();
    })
    .catch(err => {
      this.error = 'Something went wrong. Please try again.';
    });
  }
}
