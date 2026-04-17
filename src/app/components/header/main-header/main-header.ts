import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WsService } from '../../../services/websocket.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../models/models';


@Component({
  selector: 'app-main-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css'
})
export class MainHeader implements OnInit{

  notifications: Notification[] = [];
  isLoggedIn: boolean = false;

  constructor(private wsService: WsService, private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {

        this.isLoggedIn = loggedIn;

        const token = this.authService.getAccessToken();
        this.wsService.connect(token);

        this.wsService.notifications$.subscribe(notifications => {
          this.notifications = notifications;
        });
      }
    });
  }



onNotificationClick(notification: Notification): void {
    this.wsService.send(notification);

  if(this.authService.getUserRole() === 'EDITOR'){
    this.router.navigate(['/app/inventory-managment'], { queryParams: { highlight: notification.orderId } });
  }else if(this.authService.getUserRole() === 'USER'){
    this.router.navigate(['/app/order-managment'], { queryParams: { highlight: notification.orderId } });
  }else if (this.authService.getUserRole() === 'ADMIN'){
    this.router.navigate(['/app/inventory-managment'], { queryParams: { highlight: notification.orderId } });
  }
}

}