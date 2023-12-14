import { Queue } from './queue';


class WSClient {
    private queue: Queue;
    private ws: WebSocket;

    constructor(wsUrl: string, queue: Queue) {
        this.ws = new WebSocket(wsUrl);
        this.queue = queue;

        this.ws.onmessage = (event) => {
            this.onMessage(event.data);
        }

        this.ws.onerror = (event) => {
            throw event;
        }
    }

    private onMessage(raw: string) {
        this.queue.add(
            JSON.parse(raw)
        )
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