import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import * as Constants from '../constants';
import { LoginResponse } from '../../../../common/types';
import { LoginDto } from '../../../../common/types/login.dto';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessToken?: string | null;

  constructor(
    private http: HttpClient,
  ) {
    this.accessToken = localStorage.getItem(Constants.LS_ACCESS_TOKEN_KEY);
  }

  getAccessToken() {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return this.accessToken != null;
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

    localStorage.setItem(Constants.LS_ACCESS_TOKEN_KEY, this.accessToken);
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem(Constants.LS_ACCESS_TOKEN_KEY);
  }
}
