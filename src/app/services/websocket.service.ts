// ws.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../models/models';



@Injectable({
  providedIn: 'root'
})
export class WsService {
  private ws!: WebSocket;
  public notifications$ = new Subject<Notification[]>();

  connect(token : string | null) {

    this.ws = new WebSocket(`ws://localhost:8080/websocket-connection?token=${token}`);

    this.ws.onopen = (event) => {
      console.log("WebSocket connected:", event);
    };

    this.ws.onmessage = (event) => {
      const notif: Notification[] = JSON.parse(event.data);
      this.notifications$.next(notif);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Opcionalno: reconnect
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };
  }

  send(notification: Notification) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(notification));
    }
  }

  disconnect() {
    this.ws.close();
  }
}
