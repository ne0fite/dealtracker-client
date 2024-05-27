import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  static WS_API_URL = 'wss://advanced-trade-ws.coinbase.com';

  ws: WebSocket | null = null;

  connected = false;

  constructor(
    private http: HttpClient
  ) { }

  async connect(): Promise<void> {
    console.log('connecting');
    if (!this.ws) {
      this.ws = new WebSocket(WebsocketService.WS_API_URL);

      const ws = this.ws;
      ws.addEventListener('close', () => {
        console.log('web socket closed');
        this.ws = null;
      });
    }

    while (this.ws?.readyState !== 1) {
      await this.sleep(10);
    }

    console.log(this.ws.readyState);
  }

  sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async getAuthToken() {
    const url = `${environment.apiUrl}/api/v1/coinbase/auth/token`;
    const observable = this.http.get<any>(url);
    const payload = await firstValueFrom(observable);
    return payload.token;
  }

  async subscribeToProducts(products: string[], channelName: string, listener: (tickers: any[]) => void) {
    console.log('subscribing products', products, channelName);
    await this.connect();

    if (this.ws == null) {
      return;
    }

    const jwt = await this.getAuthToken();
    const message = {
      type: "subscribe",
      channel: channelName,
      product_ids: products,
      jwt,
    };
    this.ws.send(JSON.stringify(message));

    this.ws.addEventListener('message', (event: MessageEvent) => {
      const { data: dataJson } = event;
      const data = JSON.parse(dataJson);

      if (data.channel !== channelName) {
        return;
      }

      for (const event of data.events) {
        listener(event.tickers);
      }
    });
  }

  async unsubscribeToProducts(products: string[], channelName: string) {
    console.log('unsubscribing products', products, channelName);
    await this.connect();

    if (this.ws == null) {
      return;
    }

    const jwt = await this.getAuthToken();
    const message = {
      type: "unsubscribe",
      channel: channelName,
      product_ids: products,
      jwt,
    };
    this.ws.send(JSON.stringify(message));
  }
}
