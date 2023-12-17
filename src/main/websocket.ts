import { WebSocketServer } from 'ws'


enum MessageType {
    Audio,
    Video,
    Image,
    Mixed,
    Text,
};


interface Message {
    message_type: MessageType,
    steps: Action[],
}

interface Action {
    source_type: MessageType;
}

interface PositionedAction extends Action {
    position_x: number,
    position_y: number,
}

interface DurationAction extends Action {
    duration: number,
}

interface SourceAction extends Action {
    source_url: string,
}

interface ImageAction extends SourceAction, PositionedAction, DurationAction {}
interface AudioAction extends SourceAction {}
interface TextAction extends PositionedAction, DurationAction {
    font_size: number,
    font_family?: string,
    font_color?: string,
    text: string,
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
    private wss: WebSocketServer | null;

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
        this.wss = new WebSocketServer({ port: this.port });
        this.wss.on('connection', this.onConnection.bind(this));

        this.handle_forever();
    }

    private async handle_forever(): Promise<void> {
        const message = await this.queue.dequeue();

        if (!this.wss) {
            throw new Error('Websocket server not initialized');
        }

        if (message) {
            this.wss.clients.forEach((client) => {
                client.send(JSON.stringify(message));
            });
        }

        setTimeout(this.handle_forever.bind(this), 100); // TODO: make this configurable
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
    AudioAction,
    ImageAction,
    TextAction,
    MessageType,
    MessageQueue,
    WebsocketServer,
    WebsocketServerOpts,
}