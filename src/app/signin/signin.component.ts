import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';

import { SpinnerComponent } from '../spinner/spinner.component';
import { UserService } from '../services/user.service';

interface SigninUser {
  userName: string;
  password: string;
  remember: boolean;
}


@Component({
  standalone: true,
  selector: 'app-signin',
  imports: [CommonModule, RouterModule, RecaptchaV3Module, FormsModule, SpinnerComponent ], 
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
//This form is clasic ngForm model vs Reactive Forms it is a simpler form and needs reactive if using for rolebased in future versons.
   user: SigninUser = {
    userName: '',
    password: '',
    remember: false
  };

  captchaToken: string | null = null;
  data: any;
  message: string = '';
  isSuccess= false;
  //attach spinner flag
  loading = false;
  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }


  constructor(private userService: UserService, private recaptchaV3Service: ReCaptchaV3Service) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.getUserSignin();
      this.message= 'Signing in please wait...';
      this.isSuccess= true;

    }
  }

  async getUserSignin(){
    this.loading=true;
    try{
      const token = await firstValueFrom(this.recaptchaV3Service.execute('login'));
        
      // Send `token` to backend for verification
      console.log('CAPTCHA token:', token);
      // Construct your payload
      const payload = {
        username: this.user.userName,
        password: this.user.password,
        remember: this.user.remember,
        token: token
      };
      // the real url endpoint
      const url ='https://crystalhansenartographic.com/api/index-users.php/users/signin';

      const response = await this.userService.postData(url, payload);

      console.log('Backend response:', response);
      this.data = response;
      this.message = response.message || 'Reset process complete!';
      this.isSuccess = response.success;
    }catch(error){
        console.error('Failed to load data in componenet', error);
    }finally{
      this.loading=false;
    }
  }
}
