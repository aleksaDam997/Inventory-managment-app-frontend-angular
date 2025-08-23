import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateUserForm } from '../../../../models/form.models';
import { Company } from '../../../../models/models';
import { UserManagmentService } from '../../../../services/user.managment.service';
import { Users } from '../../../../models/user.model';
import { CreateUserRequest } from '../../../../models/request.model';
import { CreateApiResponse } from '../../../../models/response.models';

@Component({
  selector: 'app-upsert-user-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upsert-user-modal.html',
  styleUrl: './upsert-user-modal.css'
})
export class UpsertUserModal {
  
  @Input() show: boolean = false;
  @Input() isCreateUserModal: boolean = true;
  @Input() title = 'Dodaj korisnika';

  @Input() userForm!: FormGroup<CreateUserForm>;

  roles = ["ADMIN", "EDITOR", "USER"]

  @Input()
  companies: Company[] = [];

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<CreateApiResponse<Users>>();

  submitted = false;

  constructor(private userManagmentService: UserManagmentService) {}

  close() {
    this.closed.emit();
  }

  confirm(data: CreateApiResponse<Users>) {
    this.confirmed.emit(data);
  }

  onBackdropClick() {
    this.close();
  }

  onDialogClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit() {


    if (this.userForm.invalid) {
      return;
    }

    if(this.userForm.value.password !== this.userForm.value.passwordRepeat) {

      return;
    }

    const user: CreateUserRequest = {
      firstName: this.userForm.value.firstName!,
      lastName: this.userForm.value.lastName!,
      email: this.userForm.value.email!,
      username: this.userForm.value.username!,
      password: this.userForm.value.password!,
      role: this.userForm.value.role!,
      address: this.userForm.value.address!,
      phone: this.userForm.value.phone!,
      companyId: this.userForm.value.companyId!,
      isActive: this.userForm.value.isActive!

    };


    if(this.isCreateUserModal) {
          this.userManagmentService.createNewUser(user).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        this.confirm({
          data: user,
          message: 'User created successfully!',
          status: 'success'
        });
        this.close();

        this.userForm.reset({
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          passwordRepeat: '',
          address: '',
          phone: '',
          isActive: true
        });
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
    }
  }
}
