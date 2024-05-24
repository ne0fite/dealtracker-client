import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import * as CryptoSymbols from '../../../../common/config/crypto-symbols.json';

import { DealType, Interval, Quote, Ticker } from '../../../../common/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static cryptoSymbols = new Map(Object.entries(CryptoSymbols));

  constructor(
    private http: HttpClient
  ) { }

  async getIntraday(
    symbol: string | Ticker,
    interval: Interval,
    type: DealType
  ): Promise<Quote[]> {
    if (!['stock', 'crypto'].includes(type)) {
      throw new Error(`Unsupported deal type for intraday quotes: ${type}`);
    }

    let ticker: string;
    if (typeof symbol === 'object') {
      ticker = (symbol as Ticker).symbol;
    } else {
      ticker = symbol;
    }

    if (type === 'crypto' && !ApiService.cryptoSymbols.has(ticker)) {
      // unsupported symbol
      return [];
    }

    const url = `${environment.apiUrl}/api/v1/alphavantage/${type}/${ticker}/${interval}`;

    const observable = this.http.get<Quote[]>(url);
    return firstValueFrom(observable);
  }

  searchSymbol(keywords: string): Promise<Ticker[]> {
    const url = `${environment.apiUrl}/api/v1/alphavantage/stock/search`;
    const observable = this.http.get<Ticker[]>(url, {
      params: {
        q: keywords
      }
    });

    return firstValueFrom(observable);
  }
}
