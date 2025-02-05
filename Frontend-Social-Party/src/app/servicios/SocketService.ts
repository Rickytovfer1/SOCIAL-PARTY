import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private client: Client;
    private messageSubject: Subject<any> = new Subject();

    constructor() {
        this.client = new Client({
            webSocketFactory: () => {
                const token = sessionStorage.getItem('authToken');
                return new SockJS(`http://localhost:8080/ws?access_token=${token}`);
            },
            reconnectDelay: 5000
        });

        this.client.onConnect = () => {
            this.client.subscribe('/topic/nuevoMensaje', (message: Message) => {
                this.messageSubject.next(JSON.parse(message.body));
            });
            this.client.subscribe('/topic/mensajeEditado', (message: Message) => {
                this.messageSubject.next(JSON.parse(message.body));
            });
            this.client.subscribe('/topic/mensajeEliminado', (message: Message) => {
                this.messageSubject.next(JSON.parse(message.body));
            });
        };

        this.client.activate();
    }

    listenEvent(): Observable<any> {
        return this.messageSubject.asObservable();
    }

    disconnect() {
        this.client.deactivate();
    }
}
