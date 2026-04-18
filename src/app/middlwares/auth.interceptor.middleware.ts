import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {

      const code = error?.error?.error?.code;

      if (error.status === 401) {
        router.navigate(['/login']);
      }

      if (error.status === 403 && code === 'PASSWORD_CHANGE_REQUIRED') {
        router.navigate(['/user-profile']);
      }

      return throwError(() => error);
    })
  );
};
