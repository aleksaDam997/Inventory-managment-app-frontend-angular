import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      // Možeš redirektovati na login ili neku stranicu "Nema pristup"
      this.router.navigate(['/no-access']);
      return false;
    }
  }
}
