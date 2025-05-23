import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanMatch, Route, Router, UrlSegment, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

/**
 * Guard pour protéger les routes nécessitant une authentification
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanMatch {

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Vérifie si l'utilisateur peut accéder à une route
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAccess(route);
  }

  /**
   * Vérifie si l'utilisateur peut accéder aux routes enfants
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAccess(childRoute);
  }

  /**
   * Vérifie si l'utilisateur peut accéder à une route via le matching de route
   */
  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn() || this.router.createUrlTree(['/auth/login']);
  }

  /**
   * Vérifie l'accès en fonction des données de la route
   * @param route Route à vérifier
   * @returns true si l'accès est autorisé, sinon redirection vers login
   */
  private checkAccess(route: ActivatedRouteSnapshot): boolean | UrlTree {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: route.url.join('/') }
      });
    }

    // Vérifier les rôles requis
    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role =>
        this.authService.hasRole(role as any)
      );

      if (!hasRequiredRole) {
        // Rediriger vers la page d'accès refusé
        return this.router.createUrlTree(['/access-denied']);
      }
    }

    return true;
  }
}
