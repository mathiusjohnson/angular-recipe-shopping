import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, throwError } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import { Router } from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

const handleAuthentication = (email: string, localId: string, idToken: string, expiresIn: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000)

  return new AuthActions.AuthenticateSuccess({
      email: email,
      userId: localId,
      token: idToken,
      expirationDate
    })
  ;
}

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Incorrect email or password';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Incorrect email or password';
        break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
}
@Injectable()
export class AuthEffects {

  @Effect()
  AuthSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http
      .post<AuthResponseData>(
        'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn)
        }),
        catchError(errorRes => {
          return handleError(errorRes)
        })
      );
    })
  )

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
      .pipe(
        map(resData => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn)

        }),
        catchError(errorRes => {
          return handleError(errorRes)
        })
      );
    })

  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(() => {
      this.router.navigate(['/'])
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
