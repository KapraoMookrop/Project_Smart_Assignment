import { Injectable } from '@angular/core';
import { BehaviorSubject, asapScheduler } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  show() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      // Use asapScheduler to avoid ExpressionChangedAfterItHasBeenCheckedError
      // by pushing the update to the next microtask.
      asapScheduler.schedule(() => this.loadingSubject.next(true));
    }
  }

  hide() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      asapScheduler.schedule(() => this.loadingSubject.next(false));
    }
  }
}
