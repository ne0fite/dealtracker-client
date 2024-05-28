import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import * as Constants from '../constants';
import { LoginResponse } from '../common/types';
import { LoginDto } from '../common/types/login.dto';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessToken?: string | null;

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    this.accessToken = localStorage.getItem(Constants.LS_ACCESS_TOKEN_KEY);
    this.loggedInSubject.next(this.accessToken != null);
  }

  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Authenticate the email address and password and sets the auth token.
   * Throws error if authentication fails.
   * @param email account email address
   * @param password account password
   */
  async login(email: string, password: string) {
    const url = `${environment.apiUrl}/api/v1/auth/login`;

    const loginDto: LoginDto = {
      email,
      password
    }

    const observable = this.http.post<LoginResponse>(url, loginDto);

    const response = await firstValueFrom(observable);

    this.accessToken = response.accessToken;

    this.loggedInSubject.next(true);

    localStorage.setItem(Constants.LS_ACCESS_TOKEN_KEY, this.accessToken);
  }

  logout() {
    this.accessToken = null;
    this.loggedInSubject.next(false);
    localStorage.removeItem(Constants.LS_ACCESS_TOKEN_KEY);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$;
  }
}
