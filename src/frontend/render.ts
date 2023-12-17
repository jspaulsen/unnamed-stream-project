import { AudioAction, ImageAction, Message, MessageType, TextAction } from "./message";
import { Queue } from "./queue";


interface RenderContext {
    audio: HTMLAudioElement,
    canvas: HTMLDivElement,
}

interface VisualRender {
    position_x: number,
    position_y: number,
    duration: number,
    source_url: string,
}

class Renderer {
    private audio: HTMLAudioElement;
    private queue: Queue;
    private immediateQueue: Queue;
    private currentlyRendering: Renderable | null = null;
    private canvas: HTMLDivElement;

    constructor(queue: Queue, immediateQueue: Queue, canvas: HTMLDivElement, audio: HTMLAudioElement) {
        this.audio = audio;
        this.immediateQueue = immediateQueue;
        this.queue = queue;
        this.canvas = canvas;
    }

    public async render () {
        const immediateMessage = this.immediateQueue.get();
        const context: RenderContext = {
            audio: this.audio,
            canvas: this.canvas,
        };

        /* if we have an immediate message, we need to check if we can skip the current renderable */
        if (immediateMessage) {
            if (this.currentlyRendering && this.currentlyRendering.canBeSkipped()) {
                await this.currentlyRendering.cleanup();
                this.currentlyRendering = null;

                window.setTimeout(this.render.bind(this), 100);
                return;
            }
        }

        if (this.currentlyRendering && !this.currentlyRendering.isComplete()) {
            window.setTimeout(this.render.bind(this), 100);
            return;
        } else if (this.currentlyRendering) {
            await this.currentlyRendering.cleanup();
            this.currentlyRendering = null;
        }

        const message = this.queue.get();

        if (!message) {
            window.setTimeout(this.render.bind(this), 100);
            return;
        }
        

        const renderable = RenderableSelector.fromEvent(context, message);

        this.currentlyRendering = renderable;
        await this.currentlyRendering.render();

        window.setTimeout(this.render.bind(this), 100);
    }
}


abstract class Renderable {
    protected context: RenderContext;
    private canSkip: boolean = false;

    constructor(context: RenderContext, canSkip: boolean) {
        this.context = context;
    }

    abstract render(): Promise<void>;
    abstract isComplete(): boolean;
    abstract cleanup(): Promise<void>;

    canBeSkipped(): boolean {
        return this.canSkip;
    }

    static fromEvent(context: RenderContext, message: Message): Renderable {
        throw new Error('Not implemented');
    }
}

class AudioRenderable extends Renderable {
    private audio: HTMLAudioElement;
    private hasCompleted: boolean = false;
    private src: string;
    
    constructor(context: RenderContext, message: Message) {
        const action = message.steps[0] as AudioAction;

        super(context, message.skippable || false);

        this.audio = context.audio;
        this.src = action.source_url;
        this.audio.onended = this.completed.bind(this);
    }

    completed() {
        this.hasCompleted = true;
    }
    
    isComplete(): boolean {
        return this.hasCompleted;
    }

    async _play() {
        this.audio.play();
    }

    async render () {
        this.audio.src = this.src;
        this.audio.oncanplay = this._play.bind(this);
    }

    async cleanup() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.onended = null;
    }

    static fromEvent(context: RenderContext, message: Message): AudioRenderable {
        return new AudioRenderable(context, message);
    }
}

abstract class TimedRenderable extends Renderable {
    private startedAt: number;
    private duration: number;

    constructor(context: RenderContext, message: Message, duration: number) {
        super(context, message.skippable || false);

        this.startedAt = Date.now();
        this.duration = duration * 1000;
    }

    isComplete(): boolean {
        return Date.now() - this.startedAt > this.duration;
    }
}

class TextRenderable extends TimedRenderable {
    private text: HTMLDivElement;

    constructor(context: RenderContext, message: Message) {
        const render = message.steps[0] as TextAction;

        super(context, message, render.duration);

        this.text = document.createElement('div');
        this.text.innerText = render.text;

        // set the position
        this.text.style.position = 'absolute';
        this.text.style.left = `${render.position_x}px`;
        this.text.style.top = `${render.position_y}px`;

        // set the font size
        if (render.font_size) {
            this.text.style.fontSize = `${render.font_size}px`;
        }

        // set the font family
        if (render.font_family) {
            this.text.style.fontFamily = render.font_family;
        }

        // set the font color
        if (render.font_color) {
            this.text.style.color = render.font_color;
        }
    }

    async render() {
        this
            .context
            .canvas
            .appendChild(this.text);
    }

    async cleanup() {
        this.text.remove();
    }

    static fromEvent(context: RenderContext, message: Message): TextRenderable {
        return new TextRenderable(context, message);
    }
}

class ImageRenderable extends TimedRenderable {
    private image: HTMLImageElement;

    constructor(context: RenderContext, message: Message) {
        const render = message.steps[0] as ImageAction;

        super(context, message, render.duration);

        this.image = new Image();
        this.image.src = render.source_url;

        // set the position
        this.image.style.position = 'absolute';
        this.image.style.left = `${render.position_x}px`;
        this.image.style.top = `${render.position_y}px`;
    }

    async render() {
        this
            .context
            .canvas
            .appendChild(this.image);
    }

    async cleanup() {
        this.image.remove();
    }

    static fromEvent(context: RenderContext, message: Message): ImageRenderable {
        const action: ImageAction  = message.steps[0] as ImageAction;

        return new ImageRenderable(context, message);
    }
}

class MixedRenderable extends Renderable {
    private renderables: Renderable[];

    constructor(context: RenderContext, message: Message, renderables: Renderable[]) {
        super(context, message.skippable || false);

        this.renderables = renderables;
    }

    async render() {
        this.renderables.forEach(renderable => {
            renderable.render();
        });
    }

    isComplete(): boolean {
        return this.renderables.every(renderable => {
            return renderable.isComplete();
        });
    }

    static fromEvent(context: RenderContext, message: Message): MixedRenderable {
        const renderables = message.steps.map(step => {
            const newMessage = {
                message_type: step.source_type,
                steps: [step],
            };

            return RenderableSelector.fromEvent(context, newMessage);
        });

        return new MixedRenderable(context, message, renderables);
    }

    async cleanup() {
        this.renderables.forEach(renderable => {
            renderable.cleanup();
        });
    }
}


class RenderableSelector {
    static fromEvent(context: RenderContext, message: Message): Renderable {
        const messageType = message.message_type;
        let classType = null;
        
        switch (messageType) {
            case MessageType.Audio:
                classType = AudioRenderable;
                break;
            case MessageType.Image:
                classType = ImageRenderable;
                break;
            case MessageType.Mixed:
                classType = MixedRenderable;
                break;
            case MessageType.Text:
                classType = TextRenderable;
                break;
            default:
                throw new Error('Unknown message type');
        }

        return classType.fromEvent(context, message);
    }
}


export {
    Renderer,
    RenderableSelector,
    Renderable,
    RenderContext,
    AudioRenderable,
    ImageRenderable,
}