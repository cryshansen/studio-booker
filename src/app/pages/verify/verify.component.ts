import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-verify',
  imports: [CommonModule, RouterModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit{
  message: string = 'Verifying...';
  loading=true;
  isSuccess = false;

//entrypoint  'https://booker.crystalhansenartographic.com/verify?token=e9a18f02b34fb36f01827d8e22dc585a&email=info%40ecry.com,


  constructor(private route: ActivatedRoute,private userService:UserService) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');
    if (!token || !email) {
      this.message = 'Invalid verification link.';
      this.loading = false;
      return;
    }


    if (token && email) {
      try{
          const payload = {
            token: token, //e9a18f02b34fb36f01827d8e22dc585a
            email: email, //info@ecry.com
          };
                // the real url endpoint
          const url ='https://crystalhansenartographic.com/api/index-users.php/users/verifyemail';
          
          const response = await this.userService.postData(url, payload);

          console.log('Backend response:', response);

          this.message = response.message || 'Verification successful!';
          this.isSuccess = true;
      } catch (error:any) {
            this.message = error.error?.message || '❌ Verification failed.';
            this.isSuccess = false;
      } finally {
            this.loading = false;
      }

    } else {
      this.message = '❌ Invalid verification link.';
      this.isSuccess = false;
      this.loading = false;
    }
  }

}



