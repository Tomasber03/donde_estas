import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notification$: Observable<Notification | null> = this.notificationSubject.asObservable();
  private hideTimeout: any = null;

  constructor(private ngZone: NgZone) {}

  showSuccess(message: string) {
    this.clearTimeout();
    this.notificationSubject.next({ message, type: 'success' });
    this.autoHide();
  }

  showError(message: string) {
    this.clearTimeout();
    this.notificationSubject.next({ message, type: 'error' });
    this.autoHide();
  }

  showInfo(message: string) {
    this.clearTimeout();
    this.notificationSubject.next({ message, type: 'info' });
    this.autoHide();
  }

  hide() {
    this.clearTimeout();
    this.notificationSubject.next(null);
  }

  private clearTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private autoHide() {
    this.hideTimeout = setTimeout(() => {
      this.ngZone.run(() => {
        this.hide();
      });
    }, 3000);
  }
}
