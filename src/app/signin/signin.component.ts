import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  standalone: true,
  selector: 'app-signin',
  imports: [RouterModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  
  data:any;

  constructor(private userService: UserService) {}

  async getUserSignin(){
    try{
        this.data = await this.userService.fetchData(`https://jsonplaceholder.typicode.com/users`);
    }catch(error){
        console.error('Failed to load data in componenet', error);
    }
  }
}
