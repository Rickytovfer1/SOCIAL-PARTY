import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { Injectable } from "@angular/core";

interface SubscriptionRequest {
    emisorId: number;
    receptorId: number;
}

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private client: Client;
    private messageSubject: Subject<any> = new Subject();
    private pendingSubscriptions: SubscriptionRequest[] = [];
    private pendingSolicitudes: number[] = [];
    private connected: boolean = false;

    constructor() {
        this.client = new Client({
            webSocketFactory: () => {
                const token = sessionStorage.getItem('authToken');
                return new SockJS("http://localhost:8080/ws?access_token=" + token);
            },
            reconnectDelay: 5000,
            onConnect: frame => {
                console.log('Socket connected!', frame);
                this.connected = true;
                while (this.pendingSubscriptions.length > 0) {
                    const req = this.pendingSubscriptions.shift();
                    if (req) {
                        this.doSubscribe(req.emisorId, req.receptorId);
                    }
                }
                while (this.pendingSolicitudes.length > 0) {
                    const userId = this.pendingSolicitudes.shift();
                    if (userId !== undefined) {
                        const topic = `/topic/solicitudes/${userId}`;
                        this.client.subscribe(topic, (message: Message) => {
                            this.messageSubject.next(JSON.parse(message.body));
                        });
                    }
                }
            },
            onStompError: frame => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onDisconnect: () => {
                console.log('Socket disconnected!');
                this.connected = false;
            }
        });
        this.client.activate();
    }

    subscribeToSolicitudes(userId: number) {
        const topic = `/topic/solicitudes/${userId}`;
        if (!this.connected) {
            this.pendingSolicitudes.push(userId);
        } else {
            this.client.subscribe(topic, (message: Message) => {
                console.log("Received message on topic " + topic, message);
                const parsed = JSON.parse(message.body);
                this.messageSubject.next(parsed);
            });
        }
    }


    subscribeToConversation(emisorId: number, receptorId: number) {
        if (!this.connected) {
            this.pendingSubscriptions.push({ emisorId, receptorId });
        } else {
            this.doSubscribe(emisorId, receptorId);
        }
    }

    private doSubscribe(emisorId: number, receptorId: number) {
        const c1 = `/topic/conversacion/${emisorId}-${receptorId}`;
        const c2 = `/topic/conversacion/${receptorId}-${emisorId}`;

        this.client.subscribe(c1, (message: Message) => {
            this.messageSubject.next(JSON.parse(message.body));
        });
        this.client.subscribe(c2, (message: Message) => {
            this.messageSubject.next(JSON.parse(message.body));
        });
    }

    listenEvent(): Observable<any> {
        return this.messageSubject.asObservable();
    }

    disconnect() {
        this.client.deactivate();
    }
}
