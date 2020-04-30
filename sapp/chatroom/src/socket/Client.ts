/**
 * 客户端
 * @author dodo
 * @date 2020.04.23
 */

import { Socket } from "net";
import core from "../core/Core";
import { EVENT_RECV_DATA } from "../core/Events";
import IClient from "../interface/IClient";
import Dev from "../utils/Dev";

const HEAD_SIZE = 4;
let gen_id = 0;

export default class Client implements IClient {
    public constructor(socket: Socket, closeListener?: (client: Client) => void) {
        this.m_socket = socket;
        this.m_closeListener = closeListener;
        this.m_id = "Socket: " + ++gen_id;
    }

    public get clientId() {
        return this.m_id;
    }

    public run() {
        let handle = setInterval(() => {
            while (this.m_queue.length > 0) {
                const data = this.m_queue.splice(0, 1)[0];
                const s = data.toString();
                if (s === "ping") {
                    Dev.print("Socket Server Client Recv", "PING");
                    this.pong();
                } else {
                    core.emit(EVENT_RECV_DATA, data.toString(), this);
                }
            }
        }, 0);

        this.m_socket.on("close", (had_error) => {
            Dev.print("Socket Server Client Close", "had_error = " + had_error);
            clearInterval(handle);

            if (this.m_closeListener) {
                this.m_closeListener(this);
            }
        });
        this.m_socket.on("data", (data) => {
            this.decode(data);
        });
        this.m_socket.on("error", (err) => {
            Dev.print("Socket Server Client Error", err.toString());
        });
        this.m_socket.on("timeout", () => {
            Dev.print("Socket Server Client Timeout");
        });
    }

    public encodeSend(data: Buffer): void {
        let headBuf = Buffer.alloc(HEAD_SIZE);
        headBuf.writeUInt32BE(data.length);
        this.m_socket.write(Buffer.concat([headBuf, data]));
    }

    public sendBuffer(buf: Buffer): void {
        this.encodeSend(buf);
    }

    public sendString(s: string): void {
        this.encodeSend(Buffer.from(s));
    }

    public decode(data: Buffer): void {
        if (this.m_buffer === undefined) {
            this.m_buffer = data;
        } else {
            this.m_buffer = Buffer.concat([this.m_buffer, data]);
        }

        while (this.m_buffer.length >= this.m_readSize) {
            if (this.m_isReadHead) {
                this.m_readSize = this.m_buffer.readUInt32BE();
                this.m_isReadHead = false;
                this.m_buffer = this.m_buffer.slice(HEAD_SIZE);
            } else {
                let buf = this.m_buffer.slice(0, this.m_readSize);
                this.m_queue.push(buf);

                this.m_buffer = this.m_buffer.slice(this.m_readSize);
                this.m_readSize = HEAD_SIZE;
                this.m_isReadHead = true;
            }
        }
    }

    public ping(): void {
        this.encodeSend(Buffer.from("ping"));
    }

    public pong(): void {
        this.encodeSend(Buffer.from("pong"));
        Dev.print("Socket Server Client Send", "PONG");
    }

    private m_socket: Socket;
    private m_buffer: Buffer | undefined;
    private m_isReadHead: boolean = true;
    private m_readSize: number = HEAD_SIZE;
    private m_queue: Buffer[] = [];
    private m_closeListener: ((client: Client) => void) | undefined;
    private m_id: string;
}
