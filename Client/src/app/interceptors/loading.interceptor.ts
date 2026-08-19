import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Check if we should skip the global loader
  if (req.headers.has('X-Skip-Loader')) {
    const cleanHeaders = req.headers.delete('X-Skip-Loader');
    const newReq = req.clone({ headers: cleanHeaders });
    return next(newReq);
  }

  // Show loader on request
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Hide loader when request completes or errors
      loadingService.hide();
    })
  );
};
