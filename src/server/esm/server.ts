import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Server } from 'net';

const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});