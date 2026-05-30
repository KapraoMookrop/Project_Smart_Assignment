import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Show loader on request
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Hide loader when request completes or errors
      loadingService.hide();
    })
  );
};
