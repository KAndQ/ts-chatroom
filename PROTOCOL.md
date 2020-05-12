# PROTOCOL

使用 TypeScript 作为协议数据定义描述语言.

## I. Data Struct

### IChatUser

```TypeScript
interface IChatUser {
    uid: number; // id
    nickname: string; // 昵称
    password: string; // 密码
    loginTime: number; // 登录时间
    logoutTime: number; // 登出时间
}
```

### IChatMessage

```TypeScript
interface IChatMessage {
    mid: number; // 消息的 id
    fromUid: number; // 发送用户 id
    msendTimestamp: number; // 发送时间戳, 以秒为单位
    message: ChatMessageElemUnion; // 发送元素
}
```

### IChatRoom

```TypeScript
interface IChatRoom {
    roomId: number;
    roomName: string;
    onlineUsers: IChatUser[];
}
```

### ChatMessageElem

```TypeScript
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

type ChatMessageElemUnion = ChatMessageElemText | ChatMessageElemEmotion | ChatMessageElemLink | ChatMessageElemFile | ChatMessageElemImage;
```

## II. Request/Response

### 登录 login

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestLogin {
    nickname: string;
    password: string;
}

interface ResponseLogin {
    chatUser?: IChatUser; // 成功有值
    errString?: string; // 不成功有值, 错误原因
}
```

### 心跳 heartbeat

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestHeartbeat {
}

interface ResponseHeartbeat {
}
```

### 发送消息 sendMessage

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestSendMessage {
    elem: ChatMessageElemUnion;
}

interface ResponseSendMessage {
    success: boolean;
    message?: IChatMessage;
}
```

### 服务器推送消息 pushMessage

- [ ] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestPushMessage {
    message: ChatMessageElemUnion;
}
```

### 从服务器拉取聊天信息 pullMessages

- [x] HTTP
- [x] socket
- [x] websocket

```TypeScript
interface RequestPullMessages {
    mid?: number; // 消息的 id, 不传则拉取最新的消息
    count: number; // 拉取消息的数量
}

interface ResponsePullMessages {
    messages: IChatMessage[];
}
```

### 上传文件 uploadFile

使用 http 协议上传文件, 返回文件的下载地址

### 上传图片 uploadImage

使用 http 协议上传图片, 返回图片的下载地址

### 用户上线/下线推送 pushChatUserStatus

```TypeScript
enum ChatUserStatus {
    ONLINE,
    OFFLINE,
}

interface RequestPushChatUserStatus {
    chatUser: IChatUser;
    status: ChatUserStatus;
}
```

### 请求房间信息 getRoomInfo

```TypeScript
interface RequestGetRoomInfo {
}

interface ResponseGetRoomInfo {
    room: IChatRoom;
}
```

### 请求用户信息 getUserInfo

```TypeScript
interface RequestGetUserInfo {
    uid: number;
}

interface ResponseGetUserInfo {
    chatUser?: IChatUser;
}
```
