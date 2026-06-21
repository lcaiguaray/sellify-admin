import { HttpInterceptorFn } from '@angular/common/http';
import { authInterceptor } from '@modules/auth';

export const coreInterceptors: HttpInterceptorFn[] = [authInterceptor];
