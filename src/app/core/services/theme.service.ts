import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private platformId = inject(PLATFORM_ID);
    theme = signal<Theme>('dark');

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem('theme') as Theme | null;
            const preferred = stored ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
            this.setTheme(preferred);
        }
    }

    toggle() {
        this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
    }

    private setTheme(theme: Theme) {
        this.theme.set(theme);
        if (isPlatformBrowser(this.platformId)) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }
}
