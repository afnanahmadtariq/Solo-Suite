import { Injectable, signal } from '@angular/core';

export interface PopupConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface PopupState extends PopupConfig {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private readonly state = signal<PopupState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    resolve: null
  });

  readonly popup = this.state.asReadonly();

  confirm(config: PopupConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.state.set({
        isOpen: true,
        title: config.title,
        message: config.message,
        confirmText: config.confirmText ?? 'Confirm',
        cancelText: config.cancelText ?? 'Cancel',
        type: config.type ?? 'info',
        resolve
      });
    });
  }

  close(result: boolean): void {
    const currentState = this.state();
    if (currentState.resolve) {
      currentState.resolve(result);
    }
    this.state.set({
      isOpen: false,
      title: '',
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      type: 'info',
      resolve: null
    });
  }
}
