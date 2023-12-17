import { Message, MessageType, Action, ImageAction } from "./message";
import { Renderer, RenderableSelector, RenderContext } from "./render";
import { Queue } from "./queue";

describe('render', () => {
    it('should render an image', () => {
        const message: Message = {
            message_type: MessageType.Image,
            steps: [{
                source_type: MessageType.Image,
                source_url: 'https://i.imgur.com/9g7Bk2D.jpg',
            } as ImageAction],
        };
        
        const mock_div = {
            appendChild: jest.fn(),
        }

        const mock_img = {}

        // create mock div and audio
        // create a mock object for the context
        const context = {
            canvas: mock_div,
            audio: mock_img,
        } as unknown as RenderContext;
    
        const renderable = RenderableSelector.fromEvent(context, message);

        expect(renderable).toBeDefined();
        expect(renderable.render).toBeDefined();

        renderable.render();

        expect(mock_div.appendChild).toHaveBeenCalled();
    });

    it('should render an audio', () => {
        const message: Message = {
            message_type: MessageType.Audio,
            steps: [{
                source_type: MessageType.Audio,
                source_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            } as Action],
        };

        const mock_div = {
            appendChild: jest.fn(),
        }

        const mock_audio = {
            src: jest.fn(),
            play: jest.fn(),
            pause: jest.fn(),
            oncanplay: null as null,
        }

        // create a mock object for the context
        const context = {
            canvas: mock_div,
            audio: mock_audio,
        } as unknown as RenderContext;
    
        const renderable = RenderableSelector.fromEvent(context, message);

        expect(renderable).toBeDefined();
        expect(renderable.render).toBeDefined();

        renderable.render();

        expect(mock_audio.oncanplay).toBeDefined();

        renderable.cleanup();

        expect(mock_audio.pause).toHaveBeenCalled();
    });

    it('should render a mixed message', async () => {
        const message: Message = {
            message_type: MessageType.Mixed,
            steps: [{
                source_type: MessageType.Audio,
                source_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            } as Action, {
                source_type: MessageType.Image,
                source_url: 'https://i.imgur.com/9g7Bk2D.jpg',
            } as ImageAction],
        };

        const mock_div = {
            appendChild: jest.fn(),
        }

        const mock_audio = {
            src: jest.fn(),
            play: jest.fn(),
            pause: jest.fn(),
            oncanplay: null as null,
        }

        // create a mock object for the context
        const context = {
            canvas: mock_div,
            audio: mock_audio,
        } as unknown as RenderContext;
    
        const renderable = RenderableSelector.fromEvent(context, message);

        expect(renderable).toBeDefined();
        expect(renderable.render).toBeDefined();
        
        await renderable.render();

        expect(mock_audio.oncanplay).toBeDefined();

        renderable.cleanup();

        expect(mock_audio.pause).toHaveBeenCalled();
    });

    it('should run the render queue', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const message: Message = {
            message_type: MessageType.Mixed,
            steps: [{
                source_type: MessageType.Audio,
                source_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            } as Action, {
                source_type: MessageType.Image,
                source_url: 'https://i.imgur.com/9g7Bk2D.jpg',
            } as ImageAction],
        };

        const mock_div = {
            appendChild: jest.fn(),
        };

        const mock_audio = {
            src: jest.fn(),
            play: jest.fn(),
            pause: jest.fn(),
            oncanplay: null as null,
        }

        const queue = new Queue();
        const renderer = new Renderer(
            queue,
            new Queue(),
            mock_div as unknown as HTMLDivElement,
            mock_audio as unknown as HTMLAudioElement,
        );

        queue.add(message);
        await renderer.render();
        
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);
        expect(mock_audio.oncanplay).toBeDefined();
        expect(mock_div.appendChild).toHaveBeenCalled();
    });
});