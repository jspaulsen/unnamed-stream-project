enum MessageType {
    Audio,
    Video,
    Image,
    Mixed,
};


interface Message {
    message_type: MessageType,
    steps: Action[],
}


interface Action {
    source_type: MessageType,
    source_url: string,
    duration?: number,
    position_x?: number,
    position_y?: number,
};


export {
    MessageType,
    Action,
    Message,
}