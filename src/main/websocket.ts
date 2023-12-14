import * as WebSocket from 'ws';


enum MessageType {
    Audio,
    Video,
    Image,
    Mixed,
};

interface Action {
    source_type: MessageType,
    source_url: string,
    duration?: number,
    position_x?: number,
    position_y?: number,
};

interface Message {
    message_type: MessageType,
    steps: Action[],
}

interface WebsocketServerOpts {
    port: number;
    queue: MessageQueue;
}


class MessageQueue {
    private queue: Message[];

    constructor() {
        this.queue = [];
    }

    public async dequeue(): Promise<Message | null> {
        const result = this.queue.shift();

        if (result) {
            return result;
        }

        return null;
    }

    public async enqueue(message: Message): Promise<void> {
        this.queue.push(message);
    }
}

class WebsocketServer {
    private port: number;
    private queue: MessageQueue;
    private wss: WebSocket.Server | null;

    constructor(opts: WebsocketServerOpts) {
        this.port = opts.port;
        this.queue = opts.queue;
        this.wss = null;

        // TODO: eventually we're going to setup a message queue which will
        //       be used to send messages to the websocket server. This will
    }

    private onConnection(ws: WebSocket) {
        console.log('onConnection');
    }

    public run() {
        this.wss = new WebSocket.Server({ port: this.port });
        this.wss.on('connection', this.onConnection.bind(this));

        this.handle_forever();
    }

    private async handle_forever(): Promise<void> {
        const message = await this.queue.dequeue();

        if (!this.wss) {
            throw new Error('Websocket server not initialized');
        }

        if (message) {
            console.log('Sending message to clients');
            this.wss.clients.forEach((client) => {
                client.send(JSON.stringify(message));
            });
        }

        setTimeout(this.handle_forever.bind(this), 100);
    }

    public close(): void {
        if (!this.wss) {
            throw new Error('Websocket server not initialized');
        }
        
        this.wss.close();
    }
}

export {
    Action,
    Message,
    MessageType,
    MessageQueue,
    WebsocketServer,
    WebsocketServerOpts,
}