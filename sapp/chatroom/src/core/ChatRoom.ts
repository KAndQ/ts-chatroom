/**
 * 聊天室
 * @author dodo
 * @date 2020.04.27
 */

import core from "./Core";
import { EVENT_RECV_DATA, EVENT_CONNECT_CLOSE } from "./Events";
import ChatUser from "./ChatUser";
import Dev from "../utils/Dev";
import db from "../db/DataBase";
import DBUser from "../db/DBUser";
import {
    ResponseLogin,
    RequestLogin,
    ChatUserStatus,
    ChatMessage,
    ChatMessageElemUnion,
    ChatClient,
} from "./ProtocolTypes";

export default class ChatRoom {
    public run(): void {
        core.on(EVENT_RECV_DATA, (data, client: ChatClient) => {
            try {
                const tdata = JSON.parse(data) as ChatMessage;
                switch (tdata.cmd) {
                    case "login":
                        this.login(tdata.request, client).then((response) => {
                            client.sendString(
                                JSON.stringify({ cmd: tdata.cmd, session: tdata.session, response })
                            );
                        });
                        break;
                    case "sendMessage":
                        break;
                    case "pullMessages":
                        break;
                    case "uploadFile":
                        break;
                    case "uploadImage":
                        break;
                    case "heartbeat":
                        break;
                }
            } catch (e) {
                Dev.print("Chat Room Error", e.toString());
            }
        });

        core.on(EVENT_CONNECT_CLOSE, (client: ChatClient) => {
            Dev.print("Chat Room", "connect close");

            const chatUser = this.m_id2Users.get(client.clientId);
            if (chatUser) {
                this.m_id2Users.delete(client.clientId);
                this.m_id2Clients.delete(client.clientId);
                DBUser.logout(db, chatUser);
                this.pushChatUserStatus(chatUser, ChatUserStatus.OFFLINE);
            }
        });
    }

    public async login(request: RequestLogin, client: ChatClient): Promise<ResponseLogin> {
        try {
            const chatUser = await DBUser.login(db, request.nickname, request.password);
            this.m_id2Users.set(client.clientId, chatUser);
            this.m_id2Clients.set(client.clientId, client);
            this.pushChatUserStatus(chatUser, ChatUserStatus.ONLINE);
            return { chatUser };
        } catch (e) {
            return { errString: e.message };
        }
    }

    public heartbeat(client: ChatClient) {}

    public sendMessage(
        request: {
            message: ChatMessageElemUnion;
        },
        client: ChatClient
    ) {}

    public pullMessages(
        request: {
            timestamp?: number; // 不传表示拉取最新的信息
            count: number; // 拉取消息的数量
        },
        client: ChatClient
    ) {}

    public uploadFile(request: { base64String: string }, client: ChatClient) {}

    public uploadImage(request: { base64String: string }, client: ChatClient) {}

    public pushChatUserStatus(chatUser: ChatUser, status: ChatUserStatus) {
        this.m_id2Users.forEach((v, k) => {
            if (v !== chatUser) {
                const client = this.m_id2Clients.get(k);
                if (client) {
                    client.sendString(
                        JSON.stringify({
                            cmd: "pushChatUserStatus",
                            session: ++this.m_session,
                            request: { chatUser, status },
                        })
                    );
                }
            }
        });
    }

    private m_users: ChatUser[] = [];
    private m_id2Users: Map<string, ChatUser> = new Map();
    private m_id2Clients: Map<string, ChatClient> = new Map();
    private m_roomName: string = "";
    private m_roomId: number = 0;
    private m_session: number = 0;
}
