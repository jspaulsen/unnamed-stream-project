import { LRUCache } from "lru-cache";

class VirtualFile {
    public content: Buffer;
    public contentType: string;

    constructor(content: Buffer, contentType: string) {
        this.content = content;
        this.contentType = contentType;
    }
}

class FileCache {
    private cache: LRUCache<string, VirtualFile>;

    constructor() {
        this.cache = new LRUCache({ max: 25 }); // TODO: make this configurable
    }

    public get(key: string): VirtualFile | undefined {
        return this.cache.get(key);
    }

    public set(key: string, value: VirtualFile): void {
        this.cache.set(key, value);
    }
}

export {
    FileCache,
    VirtualFile,
}