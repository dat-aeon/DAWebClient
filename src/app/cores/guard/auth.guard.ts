import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root'})

export class AuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService
  ) { }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    if(currentUser) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }

}
