import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService, Notification } from '../../../services/notification.service';
import { AlertModule } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, AlertModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
   alerts: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(alert => {
      this.alerts.push(alert);
    });
  }

  remove(index: number) {
    this.alerts.splice(index, 1);
  }
}
