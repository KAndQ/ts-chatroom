/**
 * WebSocket Client
 * @author dodo
 * @date 2020.05.07
 */

import IClient from "../interface/IClient";
import WebSocket from "ws";

let genId = 0;

export default class Client implements IClient {
    public constructor(ws: WebSocket) {
        this.m_webSocket = ws;
        this.m_clientId = "WebSocket: " + ++genId;
    }

    public get clientId() {
        return this.m_clientId;
    }

    public sendBuffer(buf: Buffer): void {
        this.m_webSocket.send(buf);
    }

    public sendString(s: string): void {
        this.m_webSocket.send(Buffer.from(s));
    }

    public ping(): void {
        this.sendString("ping");
    }

    public pong(): void {
        this.sendString("pong");
    }

    private m_webSocket: WebSocket;
    private m_clientId: string;
}
