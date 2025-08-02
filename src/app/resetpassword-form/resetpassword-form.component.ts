import { Component, Input,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormBuilder,ReactiveFormsModule, Validators,ValidationErrors, AbstractControl } from '@angular/forms';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';



import { UserService } from '../services/user.service';

interface ResetUser {
  email: string;
  password: string;
  confirmpswd: string;
}

@Component({
  selector: 'app-resetpassword-form',
  imports: [CommonModule,ReactiveFormsModule,RecaptchaV3Module],
  templateUrl: './resetpassword-form.component.html',
  styleUrl: './resetpassword-form.component.css'
})

/**
 * User clicks the link → sent to resetpassword-form page.  endpoint ->resetnewpass as post event
capture token
Validate token and expiration, then allow password reset.

Clear token after use
 */
export class ResetpasswordFormComponent implements OnInit {
  @Input() suemail: string | null = null;
  @Input() password: string | null = null;
  @Input() confirmPassword: string | null = null;
  data:any;
  user:ResetUser = {
    email:'',
    password:'',
    confirmpswd:''
  }
  captchaReady = true; // assume ready (for mock up to integrate )
  captchaToken: string = '';

  resetpassForm:  FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean=false;
  passwordTouched =false;
  
  passwordRules = {
    lengthValid: false,
    containsLetter: false,
    containsNumber: false,
    noSpecialsOrSpaces: false
  };


  constructor(private fb:FormBuilder, private userService:UserService, private recaptchaV3Service: ReCaptchaV3Service){
    this.resetpassForm = this.fb.group({
        suemail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
      },{
        validators: this.passwordMatchValidator
      });

  }

  ngOnInit(){
    this.resetpassForm.get('password')?.valueChanges.subscribe(password => {
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
    if (this.resetpassForm.invalid) {
         // Mark all controls as touched to trigger validation display
         this.resetpassForm.markAllAsTouched();
         return;
       }
       this.recaptchaV3Service.execute('signup').subscribe({
         next: (token) => {
           this.captchaToken = token;
           const formValues = this.resetpassForm.value;
           const userAccount:ResetUser = {
               email: formValues.suemail,
               password:formValues.password,
               confirmpswd: formValues.confirmPassword,
           }
           this.createNewUser(userAccount, token);
         // Proceed with useracount —  could be submitted to server here
           console.log('✅ Form is valid. Proceeding to account view..');
           //need to validate the email / passwords to == themselves. which we can get from the promo code on how to implement for autoupdates 
           console.log("userAccount Submitted:", userAccount);
         },
         error:(err) =>{
           console.error('reCaptcha error',err);
         }

    });
  }

  async createNewUser(userAccount:ResetUser, token:string){
    try{
         // const token = await firstValueFrom(this.recaptchaV3Service.execute('login'));
            
          // Send `token` to backend for verification
         //console.log('CAPTCHA token:', token);
          // Construct your payload
          const payload = {
            email: userAccount.email,
            password:userAccount.password,
            confirmPassword: userAccount.confirmpswd,
            token: token
          };
          // the real url endpoint
          const url ='https://crystalhansenartographic.com/api/index-users.php/users/signup';
    
          const response = await this.userService.postData(url, payload);
    
          console.log('Backend response:', response);
          this.data = response;
           
        }catch(error){
            console.error('Failed to load data in componenet', error);
        }
  }

}
