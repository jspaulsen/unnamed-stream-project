enum MessageType {
    Audio,
    Video,
    Image,
    Mixed,
    Text,
    Skip,
};


interface Message {
    message_type: MessageType,
    steps: Action[],
    immediate?: boolean,
    skippable?: boolean,
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


export {
    MessageType,
    Message,
    Action,
    PositionedAction,
    DurationAction,
    SourceAction,
    ImageAction,
    AudioAction,
    TextAction,
}