import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

/**
 * Guard that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (authService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/login']);
};

/**
 * Guard that prevents authenticated users from accessing the login page.
 * Redirects authenticated users to the dashboard.
 */
export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (authService.isAuthenticated()) {
        return router.createUrlTree(['/dashboard']);
    }

    return true;
};
