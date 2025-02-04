import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Petición saliente:', req);
        return next.handle(req).pipe(
            tap({
                next: event => console.log('Respuesta recibida:', event),
                error: error => console.error('Error en petición:', error)
            })
        );
    }
}
