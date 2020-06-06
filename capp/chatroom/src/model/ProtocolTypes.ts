/**
 * 协议类型定义, 这里负责类型的定义, 每个字段的具体含义请查看 PROTOCOL.md 这个文档
 * @author dodo
 * @date 2020.05.08
 */

/********************************************************************************
 * 客户端类型定义
 *********************************************************************************/

/********************************************************************************
 * 服务端类型定义
 *********************************************************************************/

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

export interface IChatUser {
    uid: number;
    nickname: string;
    password: string;
    loginTime: number;
    logoutTime: number;
}

export interface IChatMessage {
    mid: number; // 消息的 id
    fromUid: number; // 发送用户 id
    msendTimestamp: number; // 发送时间戳, 以秒为单位
    elem: ChatMessageElemUnion; // 发送元素
}

export interface IChatRoom {
    roomId: number;
    roomName: string;
    onlineUsers: IChatUser[];
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

export type ChatMessageElemUnion =
    | ChatMessageElemText
    | ChatMessageElemEmotion
    | ChatMessageElemLink
    | ChatMessageElemFile
    | ChatMessageElemImage;

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
    elem: ChatMessageElemUnion;
}

export interface ResponseSendMessage {
    success: boolean;
    message?: IChatMessage;
}

export interface RequestHeartbeat {}

export interface ResponseHeartbeat {}

export interface RequestPushChatUserStatus {
    chatUser: IChatUser;
    status: ChatUserStatus;
}

export interface RequestPullMessages {
    mid?: number; // 消息的 id, 不传则拉取最新的消息
    count: number; // 拉取消息的数量
}

export interface ResponsePullMessages {
    messages: IChatMessage[];
}

export interface RequestPushMessage {
    message: IChatMessage;
}

export interface RequestGetRoomInfo {
}

export interface ResponseGetRoomInfo {
    room: IChatRoom;
}

export interface RequestGetUserInfo {
    uid: number;
}

export interface ResponseGetUserInfo {
    chatUser?: IChatUser;
}
