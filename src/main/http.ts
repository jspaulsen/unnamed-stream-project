import express from "express";
import { FileCache, VirtualFile } from "./file_cache";
import path from "path";
import { DIST_PATH } from "./configuration";

const app = express();
const FILE_CACHE = new FileCache();


// Serve the main Electron app
app.get('/', (req, res) => {
    res.sendFile(path.join(DIST_PATH, "frontend", 'index.html'));
  });
  
// Serve the separate bundle.js
app.get('/bundle.js', (req, res) => {
    res.sendFile(path.join(DIST_PATH, "frontend", 'bundle.js'));
});

app.get('/files/encoded/:filename', (req, res) => {
    const filename = req.params.filename;
    const fpath = Buffer
        .from(filename, 'base64')
        .toString('ascii');

    res.sendFile(fpath);
});


app.get('/files/virtual/:filename', (req, res) => {
    const filename = req.params.filename;
    const file = FILE_CACHE.get(filename);

    if (!file) {
        res
            .status(404)
            .send('Not found');

        return;
    }

    res.setHeader('Content-Type', file.contentType);
    res.send(file.content);
});


export {
    app as httpServer,
    FILE_CACHE,
    VirtualFile,
}