/**
 * Socket.IO 的 socket 封装
 * @author dodo
 * @date 2020.04.30
 */

import { Socket } from "socket.io";
import IClient from "../interface/IClient";
import Dev from "../utils/Dev";

let genId = 0;

export default class Client implements IClient {
    public constructor(socket: Socket) {
        this.m_socket = socket;
        this.m_id = "SocketIO: " + ++genId;
    }

    public get clientId() {
        return this.m_id;
    }

    public sendBuffer(buf: Buffer): void {
        this.m_socket.send(buf);
    }

    public sendString(s: string): void {
        this.sendBuffer(Buffer.from(s));
    }

    public ping(): void {
        this.sendString("ping");
    }

    public pong(): void {
        this.sendString("pong");
        Dev.print("SocketIO Server Client Send", "PONG");
    }

    private m_socket: Socket;
    private m_id: string;
}
