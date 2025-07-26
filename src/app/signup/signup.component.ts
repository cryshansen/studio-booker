import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder,Validators, ReactiveFormsModule, AbstractControl,ValidationErrors } from '@angular/forms';


export interface UserAccount {
    id:number; //pass time numeric //or pass array id.
    firstname: string;
    lastName: string;
    email: string;
    password:string;
    confirmPassword: string;

}


@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  @Input() firstName:string | null = null;
  @Input() lastName: string | null = null;
  @Input() email: string | null = null;
  @Input() password: string | null = null;
  @Input() confirmPassword: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean=false;

  captchaReady = true; // assume ready (for mock up to integrate )
  captchaToken: string = '';
  signupForm: FormGroup; // in order to use in html form you need to add reactiveFormModule to imports

  constructor(private fb:FormBuilder){
    this.signupForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required],
      },{
        validators: this.passwordMatchValidator
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


  onSubmit(){

    if (this.signupForm.invalid) {
      // Mark all controls as touched to trigger validation display
      this.signupForm.markAllAsTouched();
      return;
    }
      const formValues = this.signupForm.value;
      const userAccount:UserAccount = {
          ...formValues,
          id:formValues.id, //pass time numeric //or pass array id.
          firstname: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          password:formValues.password,
          confirmPassword: formValues.confirmPassword

      }
    // Proceed with useracount —  could be submitted to server here
      console.log('✅ Form is valid. Proceeding to account view..');
      //need to validate the email / passwords to == themselves. which we can get from the promo code on how to implement for autoupdates 
      console.log("userAccount Submitted:", userAccount);
//1234Cj_Rx
     
  }

}
