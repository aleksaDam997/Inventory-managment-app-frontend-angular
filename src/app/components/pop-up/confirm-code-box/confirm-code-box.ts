import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmAuthModel } from '../../../models/request.model';
import { LoginResponse } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-code-box',
  imports: [FormsModule, CommonModule],
  templateUrl: './confirm-code-box.html',
  styleUrl: './confirm-code-box.css'
})
export class ConfirmCodeBox {
  
  userId!: number;
  validUntil!: Date;
  title?: string;
  code!: string;
  timeLeft!: number;
  interval: any;

  onConfirm?: (code: string) => void;
  onCancel?: () => void;

  constructor(private bsModalRef: BsModalRef, private authService: AuthService, private notifyService: NotificationService, private router: Router) {}

  ngOnInit(): void {
    this.setTimeLeftFromValidUntil();
    this.startTimer();
  }

  setTimeLeftFromValidUntil() {
    const now = new Date().getTime();
    const valid = new Date(this.validUntil).getTime();
    this.timeLeft = Math.max(Math.floor((valid - now) / 1000), 0);

  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft <= 0) {
        this.close(false); // auto zatvaranje
      }
    }, 1000);
  }

confirm() {
  const req: ConfirmAuthModel = {
    userId: this.userId,
    code: this.code,
    validUntil: this.validUntil,
    status: 111
  };

  this.authService.confirmAuth(req).subscribe({
    next: (res: LoginResponse) => {
      this.authService.saveAccessToken(res.accessToken);
      this.authService.saveUserRole(res.role);
      this.authService.saveCompanyId(res.companyId);
      this.authService.setUserData(res);

      this.bsModalRef.hide();  // ✅ premješteno ovdje
      this.authService.isLoggedIn$.next(true);
      this.router.navigate(['/app']);
    },
    error: (error) => {
      if (error.error && error.error.error) {
        this.notifyService.error(error.error.error);
      } 
      else if (typeof error.error === 'string') {
        this.notifyService.error(error.error);
      } 
      else {
        this.notifyService.error(error);
      }
    }
  });
}


  close(cancel: boolean) {
    if (cancel && this.onCancel) {
      this.onCancel();
    }
    this.bsModalRef.hide();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
