import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {

      console.log('Interceptor caught status:', error.status);
      console.log('Error body:', error.error);

      if (error.status === 401) {
        router.navigate(['/login']);
      }

      if (error.status === 307 && String(error.error).includes('Password change required')) {
        router.navigate(['/user-profile']);
      }

      return throwError(() => error);
    })
  );
};
