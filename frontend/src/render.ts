import { Message, MessageType } from "./message";
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
    private currentlyRendering: Renderable | null = null;
    private canvas: HTMLDivElement;

    constructor(queue: Queue, canvas: HTMLDivElement, audio: HTMLAudioElement) {
        this.audio = audio;
        this.queue = queue;
        this.canvas = canvas;
    }

    public async render () {
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
        
        const context: RenderContext = {
            audio: this.audio,
            canvas: this.canvas,
        };

        const renderable = RenderableSelector.fromEvent(context, message);

        this.currentlyRendering = renderable;
        await this.currentlyRendering.render();

        window.setTimeout(this.render.bind(this), 100);
    }
}


abstract class Renderable {
    protected context: RenderContext;

    constructor(context: RenderContext) {
        this.context = context;
    }

    abstract render(): Promise<void>;
    abstract isComplete(): boolean;
    abstract cleanup(): Promise<void>;

    static fromEvent(context: RenderContext, message: Message): Renderable {
        throw new Error('Not implemented');
    }
}

class AudioRenderable extends Renderable {
    private audio: HTMLAudioElement;
    private hasCompleted: boolean = false;
    private src: string;
    constructor(context: RenderContext, message: Message) {
        super(context);

        this.audio = context.audio;
        this.src = message.steps[0].source_url;
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

    constructor(context: RenderContext, duration: number) {
        super(context);

        this.startedAt = Date.now();
        this.duration = duration * 1000;
    }

    isComplete(): boolean {
        return Date.now() - this.startedAt > this.duration;
    }
}

class ImageRenderable extends TimedRenderable {
    private image: HTMLImageElement;

    constructor(context: RenderContext, render: VisualRender) {
        super(context, render.duration);

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
        const render = message.steps[0];

        return new ImageRenderable(context, {
            position_x: render.position_x || 0,
            position_y: render.position_y || 0,
            duration: render.duration || 0,
            source_url: render.source_url,
        });
    }
}

class MixedRenderable extends Renderable {
    private renderables: Renderable[];

    constructor(context: RenderContext, renderables: Renderable[]) {
        super(context);

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

        return new MixedRenderable(context, renderables);
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
        
        switch (messageType) {
            case MessageType.Audio:
                return AudioRenderable.fromEvent(context, message);
            case MessageType.Image:
                return ImageRenderable.fromEvent(context, message);
            case MessageType.Mixed:
                return MixedRenderable.fromEvent(context, message);
            default:
                throw new Error('Unknown message type');
        }
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