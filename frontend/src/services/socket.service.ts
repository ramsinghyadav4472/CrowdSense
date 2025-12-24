import { Client } from '@stomp/stompjs';


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:8081/ws-crowd';

class SocketService {
    client: Client;
    connected: boolean = false;

    constructor() {
        this.client = new Client({
            brokerURL: SOCKET_URL,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.connected = true;
                console.log('Connected to WebSocket');
            },
            onDisconnect: () => {
                this.connected = false;
                console.log('Disconnected from WebSocket');
            },
        });
    }

    connect(onConnectCallback?: () => void) {
        if (onConnectCallback) {
            this.client.onConnect = (frame) => {
                this.connected = true;
                console.log('Connected: ' + frame);
                onConnectCallback();
            };
        }
        this.client.activate();
    }

    disconnect() {
        this.client.deactivate();
    }

    subscribe(topic: string, callback: (message: any) => void) {
        if (!this.client.connected) {
            console.warn("Socket not connected, retrying in 1s...");
            setTimeout(() => this.subscribe(topic, callback), 1000);
            return;
        }
        this.client.subscribe(topic, (message) => {
            callback(JSON.parse(message.body));
        });
    }
}

export default new SocketService();
