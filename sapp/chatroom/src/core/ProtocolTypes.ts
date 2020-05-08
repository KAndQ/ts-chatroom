/**
 * 协议类型定义, 这里负责类型的定义, 每个字段的具体含义请查看 PROTOCOL.md 这个文档
 * @author dodo
 * @date 2020.05.08
 */

import ChatUser from "./ChatUser";

export enum ChatUserStatus {
    ONLINE,
    OFFLINE,
}

export interface ChatMessage {
    cmd: string;
    session: number;
    request?: any;
    response?: any;
}

export interface RequestLogin {
    nickname: string;
    password: string;
}

export interface ResponseLogin {
    chatUser?: ChatUser;
    errString?: string;
}
