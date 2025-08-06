import { Component, Input,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder,Validators, ReactiveFormsModule, AbstractControl,ValidationErrors } from '@angular/forms';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';

import { UserService } from '../services/user.service';
import { SpinnerComponent } from '../spinner/spinner.component';

export interface UserAccount {
    id:number; //pass time numeric //or pass array id.
    firstname: string;
    lastName: string;
    email: string;
    password:string;
    confirmPassword: string;
}

//VDB3456cs
@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule, RecaptchaV3Module, SpinnerComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent  implements OnInit {

  @Input() firstName:string | null = null;
  @Input() lastName: string | null = null;
  @Input() suemail: string | null = null;
  @Input() password: string | null = null;
  @Input() confirmPassword: string | null = null;
  
  showPassword: boolean = false;
  showConfirmPassword: boolean=false;
  passwordTouched =false;

  passwordRules = {
    lengthValid: false,
    containsLetter: false,
    containsNumber: false,
    noSpecialsOrSpaces: false
  };




  captchaReady = true; // assume ready (for mock up to integrate )
  captchaToken: string = '';
  signupForm: FormGroup; // in order to use in html form you need to add reactiveFormModule to imports
  data: any;
  message: string = ' ';
  isSuccess= false;
  //spinner 
  loading = false;

  constructor(private fb:FormBuilder, private userService:UserService, private recaptchaV3Service: ReCaptchaV3Service){
    this.signupForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        suemail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
      },{
        validators: this.passwordMatchValidator
      });
  }

  ngOnInit(){
    this.signupForm.get('password')?.valueChanges.subscribe(password => {

      this.passwordTouched = password.length > 0;
      //this.updatePasswordRules(value || '');
      this.passwordRules.lengthValid = password.length >= 8 && password.length <= 20;
      this.passwordRules.containsLetter = /[A-Za-z]/.test(password);
      this.passwordRules.containsNumber = /[0-9]/.test(password);
      this.passwordRules.noSpecialsOrSpaces = /^[A-Za-z0-9]+$/.test(password);
  
    });

  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!password) return null;

    const lengthValid = password.length >= 8 && password.length <= 20;
    const containsLetter = /[A-Za-z]/.test(password);
    const containsNumber = /[0-9]/.test(password);
    const noSpecialsOrSpaces = /^[A-Za-z0-9]+$/.test(password);

    const valid = lengthValid && containsLetter && containsNumber && noSpecialsOrSpaces;

    return valid ? null : { passwordStrength: true };
  }
//not used moved to onInit
  updatePasswordRules(password: string): void {
    this.passwordRules.lengthValid = password.length >= 8 && password.length <= 20;
    this.passwordRules.containsLetter = /[A-Za-z]/.test(password);
    this.passwordRules.containsNumber = /[0-9]/.test(password);
    this.passwordRules.noSpecialsOrSpaces = /^[A-Za-z0-9]+$/.test(password);
  }


  onSubmit(){

    if (this.signupForm.invalid) {
      // Mark all controls as touched to trigger validation display
      this.signupForm.markAllAsTouched();
      return;
    }
    this.recaptchaV3Service.execute('signup').subscribe({
      next: (token) => {
        this.captchaToken = token;
        const formValues = this.signupForm.value;
        const userAccount:UserAccount = {
            ...formValues,
            id:formValues.id, //pass time numeric //or pass array id.
            firstname: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.suemail,
            password:formValues.password,
            confirmPassword: formValues.confirmPassword
        }
        this.createNewUser(userAccount, token);
        this.message = 'Signing up please wait...';
        this.isSuccess= true;

      // Proceed with useracount —  could be submitted to server here
        console.log('✅ Form is valid. Proceeding to account view..');
        //need to validate the email / passwords to == themselves. which we can get from the promo code on how to implement for autoupdates 
        console.log("userAccount Submitted:", userAccount);
        
      },
      error:(err) =>{
        console.error('reCaptcha error',err);
      }

    });
// 1234CjRx
     
  }

  async createNewUser(userAccount:UserAccount, token:string){
    this.loading = true;
    try{
         // const token = await firstValueFrom(this.recaptchaV3Service.execute('login'));
            
          // Send `token` to backend for verification
         //console.log('CAPTCHA token:', token);
          // Construct your payload
          const payload = {
            username: userAccount.email,
            firstname: userAccount.firstname,
            lastName: userAccount.lastName,
            email: userAccount.email,
            password:userAccount.password,
            confirmPassword: userAccount.confirmPassword,
            token: token
          };
          // the real url endpoint
          const url ='https://crystalhansenartographic.com/api/index-users.php/users/signup';
    
          const response = await this.userService.postData(url, payload);
    
          console.log('Backend response:', response);
          this.data = response;
          this.message = response.message || 'Reset process complete!';
          this.isSuccess = response.success;
        }catch(error){
            console.error('Failed to load data in componenet', error);
        }finally{
          this.loading = false;
        }
  }


}
