import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications$ = new Subject<Notification>();
  notifications$ = this._notifications$.asObservable();

  show(type: Notification['type'], message: string, timeout = 5000) {
    this._notifications$.next({ type, message, timeout });
  }

  success(message: string, timeout = 5000) {
    this.show('success', message, timeout);
  }

  error(message: string, timeout = 5000) {
    this.show('danger', message, timeout);
  }
}
