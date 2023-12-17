import { Queue } from "./queue";
import { Renderer } from "./render";
import { WSClient } from "./wsclient";


async function main() {
    const queryParameters = new URLSearchParams(window.location.search);
    const wsUrl = queryParameters.get('wsUrl');

    // TODO: We need to error better, probably just print to the browser
    if (!wsUrl) {
        onError('No wsUrl provided; use ?wsUrl=ws://localhost:8080 or configured port');
        return;
    }

    const queue = new Queue();
    const immediateQueue = new Queue();
    const websocket = new WSClient(wsUrl, queue, immediateQueue);

    const canvas = document.getElementById('canvas') as HTMLDivElement;
    const audio = document.getElementById('audio') as HTMLAudioElement;

    if (!canvas) {
        onError('No canvas element found');
        return;
    }

    if (!audio) {
        onError('No audio element found');
        return;
    }

    const renderer = new Renderer(
        queue,
        immediateQueue,
        canvas, 
        audio,
    );

    await websocket.connect();
    renderer.render();
}


function onError (event: ErrorEvent | string) {
    const errorElement = document.getElementById('error');

    if (!errorElement) {
        console.error('No error element found');
        return;
    }

    const errorParagraph = document.createElement('p');

    errorParagraph.style.color = 'red';
    errorParagraph.style.fontSize = 'xx-large';

    if (typeof event === 'string') {
        errorParagraph.innerText = event;
    } else {
        errorParagraph.innerText = event.error.message;

    }

    console.error(event);
}


// wait for the DOM to load before we start
window.addEventListener("DOMContentLoaded", async () => {
    window.addEventListener("error", onError);
    await main();
});