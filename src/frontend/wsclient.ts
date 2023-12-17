import { Message, MessageType } from './message';
import { Queue } from './queue';


class WSClient {
    private queue: Queue;
    private immediateQueue: Queue;
    private ws: WebSocket;

    constructor(wsUrl: string, queue: Queue, immediateQueue: Queue) {
        this.ws = new WebSocket(wsUrl);
        this.queue = queue;
        this.immediateQueue = immediateQueue;

        this.ws.onmessage = (event) => {
            this.onMessage(event.data);
        }

        this.ws.onerror = (event) => {
            throw event;
        }
    }

    private onMessage(raw: string) {
        const message: Message = JSON.parse(raw);

        // if the message is a skip or an immediate, we need to handle it
        if (message.message_type === MessageType.Skip  || message.immediate) {
            this.immediateQueue.add(message);
            return;
        }

        this.queue.add(message);
    }

    public async connect(): Promise<void> {
        return new Promise((resolve, _) => {
            this.ws.onopen = () => {
                resolve();
            }
        });
    }
}

export {
    WSClient,
}