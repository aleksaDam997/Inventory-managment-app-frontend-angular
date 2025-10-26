import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ConfirmCodeBox } from '../pop-up/confirm-code-box/confirm-code-box';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../services/notification.service';
import { ConfirmAuthModel } from '../../models/request.model';
import { LoginResponse } from '../../models/user.model';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

loginForm: FormGroup;
modalRefConfirm?: BsModalRef<ConfirmCodeBox>;

  constructor(private notify: NotificationService, private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private modalService: BsModalService  ) {


    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(false)
    });
  }

  onLogin() {

    type AuthResponse = LoginResponse | ConfirmAuthModel;


    this.authService.login(this.loginForm.value).subscribe({
      next: (res: AuthResponse) => {
        switch (res.status) {

          case 200: {
            const loginResponse = res as LoginResponse;

            this.authService.saveAccessToken(loginResponse.accessToken);
            this.authService.saveUserRole(loginResponse.role);
            this.authService.saveCompanyId(loginResponse.companyId);

            if (this.loginForm.value.rememberMe) {
              this.authService.saveUsername(this.loginForm.value.username);
            }

            this.authService.setUserData(loginResponse);
            this.authService.isLoggedIn$.next(true);
            if (loginResponse.role === 'ADMIN' || loginResponse.role === 'EDITOR') {
              this.router.navigate(['/app']);
            } else if (loginResponse.role === 'USER') {
              this.router.navigate(['/app/order-managment']);
            }
            break;
          }

          case 111: {

            const confirmData = res as ConfirmAuthModel;
            console.log(res)
            const modalRef = this.modalService.show(ConfirmCodeBox, {

              initialState: {
                userId: confirmData.userId,
                validUntil: confirmData.validUntil,
                // možeš proslijediti i callback ako želiš
                onConfirm: (code: string) => {
                  console.log('Kod unesen: ', code);
                  // pozovi backend za validaciju koda
                }
              },
              ignoreBackdropClick: true,
              keyboard: false
            });

            break;
          }

          default: {
            console.warn('Nepoznat status: ', res.status);
            break;
          }
        }
      },

      error: (error) => {
        const msg =
          error?.error?.error ??
          (typeof error?.error === 'string' ? error.error : 'Došlo je do greške');
        this.notify.error(msg);
      }
    });

  }
}
