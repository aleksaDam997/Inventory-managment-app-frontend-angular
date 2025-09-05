import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService  ) {


    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    });
  }

  onLogin() {

    this.authService.login(this.loginForm.value).subscribe({
        next: (loginResponse) => {
          

          if(loginResponse.status === 200) {
            this.authService.saveAccessToken(loginResponse.accessToken);
            this.authService.saveUserRole(loginResponse.role);
            this.authService.saveCompanyId(loginResponse.companyId);


            if(this.loginForm.value.rememberMe) {
              this.authService.saveUsername(this.loginForm.value.username);
            }

            this.authService.setUserData(loginResponse);

            if(loginResponse.role === 'ADMIN' || loginResponse.role === 'EDITOR') {
              this.router.navigate(['/app']);
            }else if(loginResponse.role === 'USER') {
              this.router.navigate(['/app/inventory-managment']);
            }

          }
          
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }
}
