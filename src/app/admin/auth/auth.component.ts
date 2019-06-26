import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'global-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  
  form: FormGroup;
  message: string;
  subscription: Subscription;
  
  constructor (
    private usersService: UsersService,
    private router: Router
  ) { }
  
  ngOnDestroy () {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
  
  ngOnInit () {
    this.form = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }
  
  onSubmit () {
    const formData = this.form.value;
    this.subscription = this.usersService.login({username: formData.username, password: formData.password})
      .subscribe((token: string) => {
          if (token) {
            this.message = null;
            this.usersService.getMe().subscribe((user: User) => {
              this.router.navigate(['/admin']);
            });
          } else {
            this.message = 'Пользователя с такими данными не существует.';
            setTimeout(() => {
              this.message = null;
            }, 5000);
          }
        },
        (err) => {
          if (err.status === 400) {
            this.message = 'Пользователя с такими данными не существует.';
            setTimeout(() => {
              this.message = null;
            }, 5000);
          }
        });
  }
  
}
