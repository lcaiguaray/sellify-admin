import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthFacade } from '../../application/facades/auth.facade';
import { Router } from '@angular/router';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  const cloneReq = req.clone({ withCredentials: true });

  return next(cloneReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (req.url.includes('/refresh') || req.url.includes('/login')) {
          return throwError(() => error);
        }

        return handle401Error(cloneReq, next, authFacade, router);
      }

      return throwError(() => error);
    }),
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authFacade: AuthFacade,
  router: Router,
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(false);

    return authFacade.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true);
        return next(req);
      }),
      catchError((err) => {
        isRefreshing = false;
        authFacade.clearLocalSession();
        router.navigate(['/auth/login']);
        return throwError(() => err);
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((isComplete) => isComplete),
      take(1),
      switchMap(() => {
        return next(req);
      }),
    );
  }
}
