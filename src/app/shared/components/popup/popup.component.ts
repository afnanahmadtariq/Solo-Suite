import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { PopupService } from '../../../core/services/popup.service';

@Component({
  selector: 'app-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': '!isOpen()',
    'role': 'dialog',
    'aria-modal': 'true'
  },
  template: `
    @if (isOpen()) {
      <div 
        class="fixed inset-0 z-50 overflow-y-auto"
        (keydown.escape)="onCancel()"
      >
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          (click)="onCancel()"
          aria-hidden="true"
        ></div>

        <!-- Dialog -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            class="relative transform overflow-hidden rounded-xl bg-gray-800 border border-gray-700 shadow-2xl transition-all w-full max-w-md"
            role="alertdialog"
            aria-labelledby="popup-title"
            aria-describedby="popup-message"
          >
            <!-- Header -->
            <div class="p-6 pb-4">
              <div class="flex items-center gap-4">
                <div [class]="iconContainerClass()">
                  @switch (popup().type) {
                    @case ('danger') {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                    }
                    @case ('warning') {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    }
                    @default {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    }
                  }
                </div>
                <div>
                  <h3 id="popup-title" class="text-lg font-semibold text-white">
                    {{ popup().title }}
                  </h3>
                </div>
              </div>
              <p id="popup-message" class="mt-4 text-gray-300 text-sm leading-relaxed">
                {{ popup().message }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 p-6 pt-2 justify-end">
              <button
                type="button"
                (click)="onCancel()"
                class="px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
              >
                {{ popup().cancelText }}
              </button>
              <button
                type="button"
                (click)="onConfirm()"
                [class]="confirmButtonClass()"
              >
                {{ popup().confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class PopupComponent {
  private readonly popupService = inject(PopupService);

  readonly popup = this.popupService.popup;
  readonly isOpen = computed(() => this.popup().isOpen);

  readonly iconContainerClass = computed(() => {
    const baseClass = 'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center';
    switch (this.popup().type) {
      case 'danger':
        return `${baseClass} bg-red-500/20 text-red-400`;
      case 'warning':
        return `${baseClass} bg-yellow-500/20 text-yellow-400`;
      default:
        return `${baseClass} bg-blue-500/20 text-blue-400`;
    }
  });

  readonly confirmButtonClass = computed(() => {
    const baseClass = 'px-4 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors';
    switch (this.popup().type) {
      case 'danger':
        return `${baseClass} bg-red-500 text-white hover:bg-red-600 focus:ring-red-500`;
      case 'warning':
        return `${baseClass} bg-yellow-500 text-black hover:bg-yellow-600 focus:ring-yellow-500`;
      default:
        return `${baseClass} bg-orange-500 text-black hover:bg-orange-600 focus:ring-orange-500`;
    }
  });

  onConfirm(): void {
    this.popupService.close(true);
  }

  onCancel(): void {
    this.popupService.close(false);
  }
}
