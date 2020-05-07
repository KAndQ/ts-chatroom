/**
 * Websocket 入口
 * @author dodo
 * @date 2020.05.07
 */

import Dev from "../utils/Dev";
import WebSocket from "ws";
import { WEB_SOCKET } from "../const/Consts";
import Client from "./Client";
import core from "../core/Core";
import { EVENT_CONNECT_CLOSE, EVENT_RECV_DATA } from "../core/Events";

export class Entry {
    public run(): void {
        Dev.print("WebSocket Server Entry", "Run!");

        const server = new WebSocket.Server({
            port: WEB_SOCKET,
        });
        server.on("connection", (ws) => {
            Dev.print("WebSocket Server Connection");

            const client = new Client(ws);
            ws.on("message", (data) => {
                if (data === "ping") {
                    Dev.print("WebSocket Server Recv", "PING");
                    client.pong();
                } else {
                    core.emit(EVENT_RECV_DATA, client, data);
                }
            });
            ws.on("close", (code: number, message: string) => {
                Dev.print("WebSocket Server Disconnect", message);
                core.emit(EVENT_CONNECT_CLOSE, client);
            });
        });
    }

    private static instance: Entry;
}

const entry = new Entry();
export default entry;
