import Logger from '@framework/Foundation/Logger';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as _Server, Socket as SocketType, ServerOptions } from 'socket.io';
import socketioJwt from 'socketio-jwt';

let io: _Server = <_Server>{};

class Socket {
    instance: _Socket | undefined;

    make() {

        if (this.instance) {
            return this.instance;
        }

        this.instance = new _Socket();
        return this.instance;
    }
}

export default new Socket();

class _Socket {
    public_key: string = '';
    io: _Server = <_Server>{};

    constructor() {

    }

    makeServer(server: Server<typeof IncomingMessage, typeof ServerResponse> | Server<typeof IncomingMessage, typeof ServerResponse> | undefined, config: Partial<ServerOptions>) {
        this.io = new _Server(server, {
            ...config,
            cors: {
                allowedHeaders: [
                    'accept-encoding',
                    'Accept-Encoding',
                    'accept-language',
                    'Accept-Language',
                    'accept',
                    'Accept',
                    'Access-Control-Request-Headers',
                    'Access-Control-Request-Method',
                    'Access-Control-Request-Private-Network',
                    'authorization',
                    'Authorization',
                    'cache-control',
                    'connection',
                    'Connection',
                    'Content-Length',
                    'cookie',
                    'device_id',
                    'device_id',
                    'device_name',
                    'device_name',
                    'device_os',
                    'device_os',
                    'device_type',
                    'device_type',
                    'host',
                    'Host',
                    'origin',
                    'Origin',
                    'pragma',
                    'Range',
                    'referer',
                    'Referer',
                    'sec-ch-ua-mobile',
                    'sec-ch-ua-platform',
                    'sec-ch-ua',
                    'sec-fetch-dest',
                    'Sec-Fetch-Dest',
                    'sec-fetch-mode',
                    'Sec-Fetch-Mode',
                    'sec-fetch-site',
                    'Sec-Fetch-Site',
                    'user-agent',
                    'User-Agent',
                ],
                ...config.cors
            },
        });

        Logger.log({
            level: 'info',
            name: 'socket',
            color: 'magenta',
            message:'Socket server attached to express server'
        });

        this.applyMiddlewares();
        this.handle();
    }

    applyMiddlewares() {
        this.io.use(
            socketioJwt.authorize({
                secret: this.public_key,
                handshake: true,
                auth_header_required: false,
            })
        );
    }

    handle() {
        this.io.once('connection', (socket: SocketType) => {
            this.connectedOnce(socket);
        });

        this.io.on('connection', (socket: SocketType) => {
            this.connected(socket);
        });
    }

    connected(socket: SocketType) {
        console.log('connected');

        socket.on('disconnect', () => {
            console.log('disconnected');
        });
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        socket.emit('update_content');

        socket.emit('notification', {
            id: 1,
            title: 'NoMercy Mediaserver',
            body: 'Your server has started.',
            silent: false,
            notify: true,
            read: false,
            from: 'NoMercy Mediaserver',
            method: 'add',
            to: '*',
            image: `https://cdn${process.env.ROUTE_SUFFIX ?? ''}.nomercy.tv/img/favicon.ico`,
            created_at: Date.now(),
        });
    }

    connectedOnce(socket: SocketType) {
        console.log('once connected');
    }

}
