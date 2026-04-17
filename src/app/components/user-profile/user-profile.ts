import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { LoginResponse } from '../../models/user.model';
import { UserManagmentService } from '../../services/user.managment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {

  userForm: FormGroup<any>;
  submitted = false;


  constructor(private notify: NotificationService, private authService: AuthService, 
    private userManagmentService: UserManagmentService, private router: Router) { 

    this.userForm = new FormGroup({
      email: new FormControl(''),
      oldPassword: new FormControl(''),
      passwordRepeat: new FormControl(''),
      password: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl('')
    });
  }

  onSubmit() {

    if(this.userForm.get('password')?.value !== "") {

      if(this.userForm.get('oldPassword')?.value !== this.userForm.get('passwordRepeat')?.value ||
      this.userForm.get('oldPassword')?.value === "" || this.userForm.get('passwordRepeat')?.value === "") {

        this.notify.error('Da biste promijenili lozinku, morate unijeti i staru lozinku.');
        return;
    
      }
    }


    this.userManagmentService.updateUserProfile(this.userForm.value).subscribe({
      next: (response: LoginResponse ) => {

        console.log("Hej ba: ",response)

          console.log("HI bre");
          this.authService.saveAccessToken(response.accessToken);
          this.authService.saveUserRole(response.role);
          this.authService.saveCompanyId(response.companyId);
          this.notify.success('Profil uspješno ažuriran.');

          this.authService.setUserData(response);

          const at = this.authService.getAccessToken();
          console.log("Access Token: ", at === response.accessToken);

          this.authService.isLoggedIn$.next(true);
          if (response.role === 'ADMIN' || response.role === 'EDITOR') {
              this.router.navigate(['/app']);
            } else if (response.role === 'USER') {
              this.router.navigate(['/app/order-managment']);
            }

        },
        error: (error) => {
          this.notify.error('Došlo je do greške prilikom ažuriranja profila. Molimo pokušajte ponovo.');
          console.error('Greška prilikom ažuriranja profila:', error);
        }
    });

  }
  
}
