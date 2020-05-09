/**
 * 协议类型定义, 这里负责类型的定义, 每个字段的具体含义请查看 PROTOCOL.md 这个文档
 * @author dodo
 * @date 2020.05.08
 */

export enum ChatMessageElemType {
    TEXT, // 文本
    EMOTION, // 表情
    LINK, // 链接
    FILE, // 文件
    IMAGE, // 图片
}

export enum ChatUserStatus {
    ONLINE,
    OFFLINE,
}

export enum SceneName {
    Login = "Login",
    ChatRoom = "ChatRoom",
}

export interface IChatUser {
    uid: number;
    nickname: string;
    password: string;
    loginTime: number;
    logoutTime: number;
}

export interface ChatMessageElem {
    elemType: ChatMessageElemType;
}

export interface ChatMessageElemText extends ChatMessageElem {
    text: string;
}

export interface ChatMessageElemEmotion extends ChatMessageElem {
    index: number;
}

export interface ChatMessageElemLink extends ChatMessageElem {
    url: string;
}

export interface ChatMessageElemFile extends ChatMessageElem {
    url: string;
}

export interface ChatMessageElemImage extends ChatMessageElem {
    url: string;
}

export interface NetPackage {
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
    chatUser?: IChatUser;
    errString?: string;
}

export interface RequestSendMessage {
    message: ChatMessageElemUnion;
}

export interface ResponseSendMessage {
    success: boolean;
}

export interface RequestHeartbeat {}

export interface ResponseHeartbeat {}

export interface RequestPushChatUserStatus {
    chatUser: IChatUser;
    status: ChatUserStatus;
}

export interface RequestSendMessage {
    message: ChatMessageElemUnion;
}

export type ChatMessageElemUnion =
    | ChatMessageElemText
    | ChatMessageElemEmotion
    | ChatMessageElemLink
    | ChatMessageElemFile
    | ChatMessageElemImage;