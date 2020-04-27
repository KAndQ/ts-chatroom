/**
 * 聊天室
 * @author dodo
 * @date 2020.04.27
 */

import core from "./Core";
import { EVENT_RECV_DATA, EVENT_CONNECT_CLOSE } from "./Events";
import SocketClient from "../socket/Client";
import ChatUser from "./ChatUser";

type Client = SocketClient;

enum ChatMessageElemType {
    TEXT, // 文本
    EMOTION, // 表情
    LINK, // 链接
    FILE, // 文件
    IMAGE, // 图片
}

interface ChatMessageElem {
    elemType: ChatMessageElemType;
}

interface ChatMessageElemText extends ChatMessageElem {
    text: string;
}

interface ChatMessageElemEmotion extends ChatMessageElem {
    index: number;
}

interface ChatMessageElemLink extends ChatMessageElem {
    url: string;
}

interface ChatMessageElemFile extends ChatMessageElem {
    url: string;
}

interface ChatMessageElemImage extends ChatMessageElem {
    url: string;
}

type ChatMessageElemUnion =
    | ChatMessageElemText
    | ChatMessageElemEmotion
    | ChatMessageElemLink
    | ChatMessageElemFile
    | ChatMessageElemImage;

export default class ChatRoom {
    public run(): void {
        core.on(EVENT_RECV_DATA, (data, client: Client) => {
            try {
                const tdata = JSON.parse(data);
                switch (tdata.cmd) {
                    case "login":
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
                console.log(e);
            }
        });

        core.on(EVENT_CONNECT_CLOSE, (client: Client) => {
            console.log(EVENT_CONNECT_CLOSE);
        });
    }

    public login(request: { nickname: string; password: string }, client: Client): void {}
    public heartbeat(client: Client) {}
    public sendMessage(
        request: {
            message: ChatMessageElemUnion;
        },
        client: Client
    ) {}
    public pullMessages(
        request: {
            timestamp?: number; // 不传表示拉取最新的信息
            count: number; // 拉取消息的数量
        },
        client: Client
    ) {}
    public uploadFile(request: { base64String: string }, client: Client) {}
    public uploadImage(request: { base64String: string }, client: Client) {}

    private m_users: ChatUser[] = [];
    private m_id2Users: Map<string, ChatUser> = new Map();
}
