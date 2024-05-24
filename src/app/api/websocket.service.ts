import { Injectable } from '@angular/core';
import io from 'socket.io-client';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket;

  constructor() {
    this.socket = io(environment.webSocketUrl);
  }

  sendMessage(type: string, message: object) {
    this.socket.emit(type, message);
  }

  on(type: string, callback: (...args: any) => void) {
    this.socket.on(type, callback);
  }
}
