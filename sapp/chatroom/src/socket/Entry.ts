/**
 * Socket 程序入口
 * @author dodo
 * @date 2020.04.27
 */

import { Server, createServer } from "net";
import { SOCKET_PORT } from "../const/Consts";
import Client from "./Client";
import core from "../core/Core";
import { EVENT_CONNECT_CLOSE } from "../core/Events";
import Dev from "../utils/Dev";

export class Entry {
    /**
     * 单例
     */
    public static getInstance(): Entry {
        if (this.instance === undefined) {
            this.instance = new Entry();
        }
        return this.instance;
    }

    private constructor() {
        Entry.instance = this;
    }

    public run(): void {
        Dev.print("Socket Entry", "run");

        this.m_server = createServer(sock => {
            Dev.print("Socket Server", "CONNECT");
            const client = new Client(sock, client => {
                core.emit(EVENT_CONNECT_CLOSE, client);
            });
            client.run();
        });
        this.m_server.listen(SOCKET_PORT);
    }

    private static instance: Entry;
    private m_server: Server | undefined;
}

const socketEntry = Entry.getInstance();
export default socketEntry;
