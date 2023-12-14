import { Message } from "./message";


class Queue {
    private messages: Message[] = [];

    public add(message: Message) {
        this.messages.push(message);
    }

    public get(): Message | undefined {
        return this.messages.shift();
    }
}


export {
    Queue,
    Message,
}
