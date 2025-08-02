import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormGroup, FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';

import { UserService } from '../services/user.service';

interface ResetUser {
  email: string;
}
/*✅ This form is an NgForm example 
Overview of Password Reset Flow
User requests reset via email form. !!!! This component handles this step here. !!!

Generate secure token, store it with expiry.

Send email with reset link including token and user ID (or email hash).
*/

@Component({
  selector: 'app-resetpassword',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent implements OnInit {
 user: ResetUser = {
    email: '',
  };
  data: any;
  @Input() suemail: string | null = null;
  @Input() password: string | null = null;
  @Input() confirmPassword: string | null = null;


  captchaReady = true; // assume ready (for mock up to integrate )
  captchaToken: string = '';

  constructor(private userService:UserService, private recaptchaV3Service:ReCaptchaV3Service){}

  ngOnInit(): void {
      
  }

  onSubmit(form:NgForm){
    if(!form.valid) return;
    this.recaptchaV3Service.execute('signup').subscribe({
      next: (token) => {
        this.captchaToken = token;

        const formValues = form.value; // ✅ NgForm provides values here
        const userAccount: ResetUser = {
          email: formValues.suemail,
  
        };

        this.getResetEmail(userAccount, this.captchaToken);
        console.log('✅ Form is valid. Proceeding to account view..');
        console.log("userAccount Submitted:", userAccount);
      },
      error: (err) => {
        console.error('reCaptcha error', err);
      }
  });

  }



  async getResetEmail(userAccount:ResetUser, token:string){
      try{
           // const token = await firstValueFrom(this.recaptchaV3Service.execute('login'));
              
            // Send captcha`token` to backend for verification
           //console.log('CAPTCHA token:', token);
            // Construct your payload
            const payload = {
              email: userAccount.email,
              token:token,
            };
            // the real url endpoint
            const url ='https://crystalhansenartographic.com/api/index-users.php/users/resetpassword';
      
            const response = await this.userService.postData(url, payload);
      
            console.log('Backend response:', response);
            this.data = response;
             
      }catch(error){
              console.error('Failed to load data in componenet', error);
      }
  }




}
