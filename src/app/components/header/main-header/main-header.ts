import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WsService } from '../../../services/websocket.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../models/models';
import { filter } from 'rxjs/internal/operators/filter';
import { switchMap } from 'rxjs/internal/operators/switchMap';


@Component({
  selector: 'app-main-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css'
})
export class MainHeader implements OnInit{

  notifications: Notification[] = [];
  isLoggedIn: boolean = false;
showAll = false;
  constructor(private wsService: WsService, private authService: AuthService, private router: Router){}

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(loggedIn => {

      this.isLoggedIn = loggedIn;

      if (!loggedIn) {
        this.wsService.disconnect();
        this.notifications = [];
        return;
      }

      const token = this.authService.getAccessToken();
      this.wsService.connect(token);

      this.wsService.notifications$.subscribe(n => {
        this.notifications = n;
      });
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

  onLogout(): void {

    this.authService.removeAccessToken();
    this.authService.removeUserRole();
    this.authService.removeCompanyId();
    this.authService.removeUsername();
    this.authService.removeUserdata();
    this.wsService.disconnect();
    this.authService.isLoggedIn$.next(false);
    this.router.navigate(['/login']);

  }


}